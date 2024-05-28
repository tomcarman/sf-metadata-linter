import * as fs from 'node:fs';
import { XMLParser } from 'fast-xml-parser';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';
import { SfCustomField } from '../common/metadata-types.js';

export default class FieldDescriptionMinimumLength extends RuleClass {
  public minimumLength = 50; // Default value

  public ruleId: string = 'field-description-minimum-length';
  public startLine = 1;
  public endLine = 1;

  public constructor(files: string[], level: string, options: RuleOption[]) {
    super(files, level);
    if (options) {
      const minimumLength = options.find((ruleOption) => ruleOption.name === 'minimumLength');
      if (minimumLength) {
        this.minimumLength = minimumLength.value as number;
      }
    }
  }

  public get shortDescriptionText(): string {
    return `Custom field description does not meet the minimum length (${this.minimumLength})`;
  }
  public get fullDescriptionText(): string {
    return `A custom field should have a description, describing how the field is used. The description should be at least ${this.minimumLength} characters long.`;
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
        return customFieldContents.description.length < this.minimumLength;
      }
    });

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
