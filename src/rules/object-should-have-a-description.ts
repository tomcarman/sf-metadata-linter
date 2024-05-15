import * as fs from 'node:fs';
import type { Result } from 'sarif';
import { RuleClass, SingleRuleResult } from '../common/types.js';

export default class ObjectShouldHaveADescription implements RuleClass {
  public ruleId: string = 'object-should-have-a-description';
  public shortDescriptionText = 'Custom Objects should have description.';
  public fullDescriptionText = 'Custom Objects should have a description, describing how the object is used.';
  public level: Result.level = 'warning';
  public startLine = 1;
  public endLine = 1;
  public files: string[] = [];
  public results: SingleRuleResult[] = [];

  public setFiles(files: string[]): void {
    this.files = files;
  }

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
