import * as fs from 'node:fs';
import { RuleClass, SingleRuleResult } from '../common/types.js';

export default class NoMissingDescriptionOnValidationRules extends RuleClass {
  public ruleId: string = 'no-missing-description-on-validation-rules';
  public shortDescriptionText = 'Validation rules should have a description.';
  public fullDescriptionText =
    "Validation rules should have a description describing the purpose of the validation rule. Populate the 'Description' field on the validation rule.";
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const validationRules = this.files.filter((file) => file.endsWith('.validationRule-meta.xml'));

    const ruleViolations = validationRules.filter((file) => {
      const contents = fs.readFileSync(file, 'utf-8');
      return !contents.includes('<description>');
    });

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
