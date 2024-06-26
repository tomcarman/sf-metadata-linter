import * as fs from 'node:fs';
import type { ValidationRule } from '@salesforce/types/metadata';
import type { Location } from '../common/types.js';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';
import { parseMetadataXml, getLineAndColNumber } from '../common/util.js';

export default class DescriptionMinLengthOnValidationRules extends RuleClass {
  public minimumLength = 50; // Default value

  public ruleId: string = 'description-min-length-on-validation-rules';
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
    return `Validation rule descriptions should be at least ${this.minimumLength} characters long.`;
  }
  public get fullDescriptionText(): string {
    return `Validation rule descriptions should be at least ${this.minimumLength} characters long. Update the 'Description' field on the Validation rule.`;
  }

  public execute(): void {
    const validationRules = this.files.filter((file) => file.endsWith('.validationRule-meta.xml'));

    for (const file of validationRules) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const validationRule = parseMetadataXml<ValidationRule>(fileText, 'ValidationRule');
      if (validationRule.description && validationRule.description.length < this.minimumLength) {
        const location: Location = getLineAndColNumber(this.ruleId, file, fileText, validationRule.description);
        this.results.push(
          new SingleRuleResult(file, location.startLine, location.endLine, location.startColumn, location.endColumn)
        );
      }
    }
  }
}
