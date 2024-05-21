import * as fs from 'node:fs';
import type { Result } from 'sarif';
import { XMLParser } from 'fast-xml-parser';
// import type { SfCustomField } from '../common/metadata-types.js';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { SfCustomField } from '../common/metadata-types.js';

export default class FieldDescriptionMinimumLength implements RuleClass {
  public ruleId: string = 'field-description-minimum-length';
  public shortDescriptionText = 'Custom Field Description does not meet the minimum length.';
  public fullDescriptionText = 'A Custom Field should have a description, describing how the field is used.';
  public level: Result.level = 'warning';
  public startLine = 1;
  public endLine = 1;
  public files: string[] = [];
  public results: SingleRuleResult[] = [];

  public setFiles(files: string[]): void {
    this.files = files;
  }

  public execute(): void {
    const customFields = this.files.filter(
      (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.field-meta.xml')
    );

    const ruleViolations = customFields.filter((file) => {
      const fileText = fs.readFileSync(file, 'utf-8');
      const parser = new XMLParser({ ignoreDeclaration: true });
      const customField = parser.parse(fileText) as SfCustomField;
      const customFieldContents = customField.CustomField;

      if (customFieldContents.description) {
        return customFieldContents.description.length < 100;
      }
    });

    //

    //   // eslint-disable-next-line no-console
    //   console.log(JSON.stringify(customField));
    //   // console.log(customField.CustomField.visibleLines);
    // } else {
    //   // eslint-disable-next-line no-console
    //   console.log(`Custom field ${customFieldContents.fullName} has no attribute visibleLines`);
    // }

    // return !file.includes('<description>');

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
