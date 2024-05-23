import * as fs from 'node:fs';
import type { Result } from 'sarif';
import { XMLParser } from 'fast-xml-parser';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { SfCustomField } from '../common/metadata-types.js';

export default class FieldDescriptionMinimumLength extends RuleClass {
  // Optional rule properties
  public minimumLength = 50; // Default value

  public ruleId: string = 'field-description-minimum-length';
  public shortDescriptionText = `Custom Field Description does not meet the minimum length (${this.minimumLength})`;
  public fullDescriptionText = `A Custom Field should have a description, describing how the field is used. This description should be at least ${this.minimumLength} characters long.`;
  public level: Result.level = 'warning';
  public startLine = 1;
  public endLine = 1;

  public constructor(files: string[]) {
    super(files);
    console.log('hit custom constructor');
  }

  public loadRuleProperties(): void {
    if (this.ruleProperties) {
      const minimumLength = this.ruleProperties.find((ruleProperty) => ruleProperty.name === 'minimumLength');
      if (minimumLength) {
        this.minimumLength = minimumLength.value as number;
      }
    }
  }

  public execute(): void {
    this.loadRuleProperties();
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
