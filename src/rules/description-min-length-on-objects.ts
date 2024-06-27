import * as fs from 'node:fs';
import type { CustomObject } from '@salesforce/types/metadata';
import type { Location } from '../common/types.js';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';
import { parseMetadataXml, getLineAndColNumber } from '../common/util.js';

export default class DescriptionMinLengthOnObjects extends RuleClass {
  public minimumLength = 50; // Default value

  public ruleId: string = 'description-min-length-on-objects';
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
    return `Custom object description does not meet the minimum length (${this.minimumLength})`;
  }
  public get fullDescriptionText(): string {
    return `Custom object descriptions should be at least ${this.minimumLength} characters long. Update the 'Description' field on the custom object.`;
  }

  public execute(): void {
    const customObjects = this.files.filter(
      (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.object-meta.xml')
    );

    for (const file of customObjects) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const customObject = parseMetadataXml<CustomObject>(fileText, 'CustomObject');
      if (customObject.description && customObject.description.length < this.minimumLength) {
        const location: Location = getLineAndColNumber(this.ruleId, file, fileText, customObject.description);
        this.results.push(
          new SingleRuleResult(file, location.startLine, location.endLine, location.startColumn, location.endColumn)
        );
      }
    }
  }
}
