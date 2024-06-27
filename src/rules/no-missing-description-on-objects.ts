import * as fs from 'node:fs';
import { RuleClass, SingleRuleResult } from '../common/types.js';

export default class NoMissingDescriptionOnObjects extends RuleClass {
  public ruleId: string = 'no-missing-description-on-objects';
  public shortDescriptionText = 'Custom objects should have description.';
  public fullDescriptionText = 'Custom objects should have a description, describing how the object is used.';
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const customObjects = this.files.filter(
      (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.object-meta.xml')
    );

    const ruleViolations = customObjects.filter((file) => {
      const contents = fs.readFileSync(file, 'utf-8');
      return !contents.includes('<description>');
    });

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
