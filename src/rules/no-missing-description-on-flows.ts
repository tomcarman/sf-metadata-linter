import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { parseMetadataXml } from '../common/util.js';

export default class NoMissingDescriptionOnFlows extends RuleClass {
  public ruleId: string = 'no-missing-description-on-flows';
  public shortDescriptionText = 'Flows should have a description.';
  public fullDescriptionText =
    "Flows should have a description describing the purpose of the flow. Populate the 'Description' field on the flow.";
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
