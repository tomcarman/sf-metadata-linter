import * as fs from 'node:fs';
import type { CustomField } from '@salesforce/types/metadata';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { parseMetadataXml, getLineAndColNumber } from '../common/util.js';
import type { Location } from '../common/types.js';

export default class PicklistValuesShouldNotContainDoubleSpaces extends RuleClass {
  public ruleId: string = 'picklist-values-should-not-contain-double-spaces';
  public shortDescriptionText = 'Picklist values should not contain double spaces.';
  public fullDescriptionText = "Picklist values should not contain double spaces eg. 'Offer  Made'.";
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const customFields = this.files.filter(
      (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.field-meta.xml')
    );

    customFields.forEach((file) => {
      const fileText = fs.readFileSync(file, 'utf-8');
      const customField = parseMetadataXml<CustomField>(fileText, 'CustomField');
      if (customField.type && ['Picklist', 'MultiselectPicklist'].includes(customField.type)) {
        customField.valueSet?.valueSetDefinition?.value.forEach((value) => {
          checkForDoubleSpace.call(this, file, fileText, value.label);
          checkForDoubleSpace.call(this, file, fileText, value.fullName);
        });
      }
    });

    function checkForDoubleSpace(
      this: PicklistValuesShouldNotContainDoubleSpaces,
      file: string,
      fileText: string,
      value?: string
    ): void {
      if (value?.includes('  ')) {
        const location: Location = getLineAndColNumber(fileText, value);
        this.results.push(
          new SingleRuleResult(file, location.startLine, location.endLine, location.startColumn, location.endColumn)
        );
      }
    }
  }
}
