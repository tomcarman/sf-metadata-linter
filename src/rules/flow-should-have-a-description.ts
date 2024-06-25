import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { parseMetadataXml } from '../commands/util.js';

export default class FlowShouldHaveADescription extends RuleClass {
  public ruleId: string = 'flow-should-have-a-description';
  public shortDescriptionText = 'Flows should have description.';
  public fullDescriptionText = 'Flows should have a description, describing how the Flow is used.';
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const flows = this.files.filter((file) => file.endsWith('.flow-meta.xml'));

    const ruleViolations = flows.filter((file) => {
      const fileText = fs.readFileSync(file, 'utf-8');
      const flow = parseMetadataXml<Flow>(fileText, 'Flow');
      return !flow.description;
    });

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
