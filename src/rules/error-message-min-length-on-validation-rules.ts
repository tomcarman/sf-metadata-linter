import * as fs from 'node:fs';
import type { ValidationRule } from '@salesforce/types/metadata';
import type { Location } from '../common/types.js';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';
import { parseMetadataXml, getLineAndColNumber } from '../common/util.js';

export default class ErrorMessageMinLengthOnValidationRules extends RuleClass {
  public minimumLength = 50; // Default value

  public ruleId: string = 'error-message-min-length-on-validation-rules';
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
    return `Validation rule error messages should be at least ${this.minimumLength} characters long.`;
  }
  public get fullDescriptionText(): string {
    return `Validation rule error messages should be at least ${this.minimumLength} characters long, and describe how the user should resolve the validation error. Update the 'Error Message' field on the Validation rule.`;
  }

  public execute(): void {
    const validationRules = this.files.filter((file) => file.endsWith('.validationRule-meta.xml'));

    for (const file of validationRules) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const validationRule = parseMetadataXml<ValidationRule>(fileText, 'ValidationRule');
      if (validationRule.errorMessage && validationRule.errorMessage.length < this.minimumLength) {
        const location: Location = getLineAndColNumber(this.ruleId, file, fileText, validationRule.errorMessage);
        this.results.push(
          new SingleRuleResult(file, location.startLine, location.endLine, location.startColumn, location.endColumn)
        );
      }
    }
  }
}
