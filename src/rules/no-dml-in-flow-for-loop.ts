import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass } from '../common/types.js';
import { parseMetadataXml } from '../common/util.js';
import { FlowWrapper } from '../common/experimental/FlowWrapper.js';

export default class NoDmlInFlowForLoop extends RuleClass {
  public ruleId: string = 'no-missing-description-on-fields';
  public shortDescriptionText = 'Flow loops should not contain DML operations.';
  public fullDescriptionText = 'Flow loops should not contain DML operations.';
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const flows = this.files.filter((file) => file.endsWith('.flow-meta.xml'));

    for (const file of flows) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const flow = parseMetadataXml<Flow>(fileText, 'Flow');
      const flowWrapper = new FlowWrapper(flow);

      console.log('\n\n Flow: ' + flow.label);
      console.log('\n');
      for (const node of flowWrapper.nodes) {
        console.log('\n- Node: ' + node.name);
        for (const connector of node.connectors) {
          console.log('   Connector Type: ' + connector.type);
          console.log('       Connects to :' + connector.targetReference);
        }
      }
    }
  }
}

// Flow: Sample PMD flow

// - Node: cascadeCity1
//    Connector Type: connector
//        Connects to :badUpdate1

// - Node: cascadeCity2
//    Connector Type: connector
//        Connects to :goodLoop1

// - Node: call_Apex_code
//    Connector Type: connector
//        Connects to :suspiciousLoop1

// - Node: getContacts
//    Connector Type: connector
//        Connects to :whichCity

// - Node: badUpdate1
//    Connector Type: connector
//        Connects to :badLoop1

// - Node: goodUpdate1
//    Connector Type: connector
//        Connects to :X1_more_update

// - Node: X1_more_update

// - Node: whichCity
//    Connector Type: defaultConnector
//        Connects to :suspiciousLoop1
//    Connector Type: connector
//        Connects to :badLoop1
//    Connector Type: connector
//        Connects to :goodLoop1

// - Node: badLoop1
//    Connector Type: nextValueConnector
//        Connects to :cascadeCity1
//    Connector Type: noMoreValuesConnector
//        Connects to :X1_more_update

// - Node: goodLoop1
//    Connector Type: nextValueConnector
//        Connects to :cascadeCity2
//    Connector Type: noMoreValuesConnector
//        Connects to :goodUpdate1

// - Node: suspiciousLoop1
//    Connector Type: nextValueConnector
//        Connects to :call_Apex_code
//    Connector Type: noMoreValuesConnector
//        Connects to :X1_more_update

// - Node:
//    Connector Type: connector
//        Connects to :getContacts
