import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass } from '../common/types.js';
import { parseMetadataXml } from '../common/util.js';
import { FlowWrapper } from '../common/FlowWrapper.js';

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
          // console.log('      Type: ' + connector.type);
          // console.log('      Connects To: ' + connector.targetReference);
        }
      }
    }
  }
}

// const nodes: FlowNode[] = [];

// for (const p in flow) {
//   if (Object.prototype.hasOwnProperty.call(flow, p)) {
//     if(p === 'processType') {
//       const propertyValue = flow[p];
//       if (propertyValue !== undefined) {
//         const processType: FlowProcessType = propertyValue;
//         console.log('Process Type: ' + processType);
//       }
//     } else if (p === 'recordLookups') {
//       const propertyValue = flow[p];
//       if (propertyValue !== undefined) {
//         console.log('Record Lookups: ', propertyValue);
//         const recordLookups: FlowRecordLookup[] = Array.isArray(propertyValue)
//         ? propertyValue
//         : [propertyValue];
//         recordLookups.forEach((recordLookup) => {
//           nodes.push(recordLookup);
//         });
//       }
//     }
//   }
// }

// for (const node of nodes) {
//   console.log('Node: ', node);
// }
// }
// }
// }
