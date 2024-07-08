import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass } from '../common/types.js';
import { parseMetadataXml } from '../common/util.js';
import { FlowWrapper } from '../common/experimental/FlowWrapper.js';
// import {  getPaths } from '../common/experimental/FlowWalker.js';
// import { generateMermaid } from '../common/experimental/FlowMermaid.js';
import { FlowGraph } from '../common/experimental/FlowWalkerTarjan.js';

export default class NoDmlInFlowForLoop extends RuleClass {
  public ruleId: string = 'no-missing-description-on-fields';
  public shortDescriptionText = 'Flow loops should not contain DML operations.';
  public fullDescriptionText = 'Flow loops should not contain DML operations.';
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const flows = this.files.filter((file) =>
      file.endsWith('Create_Ongoing_Advice_Review_Service_Appointment.flow-meta.xml')
    );

    for (const file of flows) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const flow = parseMetadataXml<Flow>(fileText, 'Flow');
      const flowWrapper = new FlowWrapper(flow);
      console.log('\n\n\nFlow Name: ', flowWrapper.flowName);
      // console.dir(flowWrapper, { depth: null });
      // walk(flowWrapper);
      // const paths = getPaths(flowWrapper);
      // console.log('Flow Name: ', flowWrapper.flowName, 'Paths: ', paths.length);
      // generateMermaid(flowWrapper.nodes);
      const graph = new FlowGraph(flowWrapper);
      const sccs = graph.getNonSingleStronglyConnectedNodes();

      sccs.forEach((scc) => {
        console.log('SCC: ', scc.map((node) => node.name).join(', '));
      });
    }
  }
}
