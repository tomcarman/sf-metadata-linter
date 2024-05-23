import * as fs from 'node:fs';
import type { Result } from 'sarif';
import { RuleClass, SingleRuleResult } from '../common/types.js';

export default class FieldShouldHaveADescription extends RuleClass {
  public ruleId: string = 'field-should-have-a-description';
  public shortDescriptionText = 'Custom Fields should have description.';
  public fullDescriptionText = 'A Custom Field should have a description, describing how the field is used.';
  public level: Result.level = 'warning';
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const customFields = this.files.filter(
      (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.field-meta.xml')
    );

    const ruleViolations = customFields.filter((file) => {
      const contents = fs.readFileSync(file, 'utf-8');
      return !contents.includes('<description>');
    });

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
