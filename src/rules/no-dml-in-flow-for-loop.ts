import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass } from '../common/types.js';
import { parseMetadataXml } from '../common/util.js';
import { FlowWrapper } from '../common/experimental/FlowWrapper.js';
// import {  getPaths } from '../common/experimental/FlowWalker.js';
import { generateMermaid } from '../common/experimental/FlowMermaid.js';

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

      // let i = 0;
      // paths.forEach((path) => {
      // i++
      // const hash = Md5.hashStr(path.map(entry => entry.nodeName).join(' -> '));
      // console.log('i: ', i, 'Hash: ', hash, 'Path: ', path.map(entry => entry.nodeName).join(' -> '));
      // console.log('csv: ', path.map(entry => entry.nodeName).join(', '), ',');
      // console.log('paths: ', paths.length);
      // console.log(path.map(entry => entry.nodeName).join(' -> '));
      // });

      // console.log(paths);
      // console.log('Flow Name: ', flowWrapper.flowName, 'Paths: ', paths.length);
      generateMermaid(flowWrapper.nodes);
    }
  }
}
