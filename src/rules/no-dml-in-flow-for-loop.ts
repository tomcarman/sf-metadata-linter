import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass } from '../common/types.js';
import { parseMetadataXml } from '../common/util.js';
import { FlowWrapper } from '../common/experimental/FlowWrapper.js';
import { generateMermaid, getPaths } from '../common/experimental/FlowWalker.js';

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
      // console.dir(flowWrapper.nodes, { depth: null });
      // walk(flowWrapper);
      const paths = getPaths(flowWrapper);
      console.log('Paths: ', paths.length);
      generateMermaid(flowWrapper.nodes);
    }
  }
}
