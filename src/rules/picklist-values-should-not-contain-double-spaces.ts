import * as fs from 'node:fs';
import type { CustomField } from '@salesforce/types/metadata';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { parseMetadataXml, getLineAndColNumber } from '../commands/util.js';

export default class PicklistValuesShouldNotContainDoubleSpaces extends RuleClass {
  public ruleId: string = 'picklist-values-should-not-contain-double-spaces';
  public shortDescriptionText = 'Picklist values should not contain double spaces.';
  public fullDescriptionText = "Picklist values should not contain double spaces eg. 'Status  Pending'.";
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const customFields = this.files.filter(
      (file) => (file.includes('__c') || file.includes('__e')) && file.endsWith('.field-meta.xml')
    );

    for (const file of customFields) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const customField = parseMetadataXml<CustomField>(fileText, 'CustomField');
      if (customField.type === 'Picklist' || customField.type === 'MultiselectPicklist') {
        if (customField.valueSet?.valueSetDefinition) {
          // Picklist field has inline valueset
          for (const value of customField.valueSet.valueSetDefinition.value) {
            if (value.label?.includes('  ')) {
              const [lineNumber, colNumber] = getLineAndColNumber(fileText, value.label);
              this.startLine = this.endLine = lineNumber;
              this.results.push(new SingleRuleResult(file, this.startLine, this.endLine, colNumber, colNumber));
            }
            if (value.fullName?.includes('  ')) {
              const [lineNumber, colNumber] = getLineAndColNumber(fileText, value.fullName);
              this.startLine = this.endLine = lineNumber;
              this.results.push(new SingleRuleResult(file, this.startLine, this.endLine, colNumber, colNumber));
            }
          }
        }
      }
    }
  }
}
