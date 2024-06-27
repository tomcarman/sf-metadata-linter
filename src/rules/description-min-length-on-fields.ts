import * as fs from 'node:fs';
import type { CustomField } from '@salesforce/types/metadata';
import type { Location } from '../common/types.js';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';
import { parseMetadataXml, getLineAndColNumber } from '../common/util.js';

export default class DescriptionMinLengthOnFields extends RuleClass {
  public minimumLength = 50; // Default value

  public ruleId: string = 'description-min-length-on-fields';
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
    return `Custom field descriptions should be at least ${this.minimumLength} characters long.`;
  }
  public get fullDescriptionText(): string {
    return `Custom field descriptions should be at least ${this.minimumLength} characters long. Update the 'Description' field on the custom field.`;
  }

  public execute(): void {
    const customFields = this.files.filter(
      (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.field-meta.xml')
    );

    for (const file of customFields) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const customField = parseMetadataXml<CustomField>(fileText, 'CustomField');
      if (customField.description && customField.description.length < this.minimumLength) {
        const location: Location = getLineAndColNumber(this.ruleId, file, fileText, customField.description);
        this.results.push(
          new SingleRuleResult(file, location.startLine, location.endLine, location.startColumn, location.endColumn)
        );
      }
    }
  }
}
