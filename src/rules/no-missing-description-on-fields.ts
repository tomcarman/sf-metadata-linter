import * as fs from 'node:fs';
import { RuleClass, SingleRuleResult } from '../common/types.js';

export default class NoMissingDescriptionOnFields extends RuleClass {
  public ruleId: string = 'no-missing-description-on-fields';
  public shortDescriptionText = 'Custom fields should have description.';
  public fullDescriptionText = 'Custom fields should have a description, describing how the field is used.';
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
