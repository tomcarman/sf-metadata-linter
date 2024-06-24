import * as fs from 'node:fs';
import { XMLParser } from 'fast-xml-parser';
import type { CustomObject } from '@salesforce/types/metadata';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';

export default class ObjectDescriptionMinimumLength extends RuleClass {
  public minimumLength = 50; // Default value

  public ruleId: string = 'object-description-minimum-length';
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
    return `A custom object should have a description, describing how the object is used. The description should be at least ${this.minimumLength} characters long.`;
  }

  public execute(): void {
    const customObjects = this.files.filter(
      (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.object-meta.xml')
    );

    const ruleViolations = customObjects.filter((file) => {
      const fileText = fs.readFileSync(file, 'utf-8');
      const parser = new XMLParser({ ignoreDeclaration: true });
      const customObjectFile = parser.parse(fileText) as { CustomObject: CustomObject };
      console.log(customObjectFile);
      const customObject = customObjectFile.CustomObject;

      if (customObject.description) {
        return customObject.description.length < this.minimumLength;
      }
    });

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
