import * as fs from 'node:fs';
import type { GlobalValueSet, StandardValueSet } from '@salesforce/types/metadata';
import type { Location } from '../common/types.js';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { parseMetadataXml, getLineAndColNumber } from '../common/util.js';

export default class NoDoublesSpacesInValueSets extends RuleClass {
  public ruleId: string = 'no-double-spaces-in-value-sets';
  public shortDescriptionText = 'Value Set labels and values should not contain double spaces.';
  public fullDescriptionText = "Value Set labels and values should not contain double spaces eg. 'Offer  Made'.";
  public startLine = 1;
  public endLine = 1;

  public execute(): void {
    const valueSets = this.files.filter(
      (file) => file.endsWith('.standardValueSet-meta.xml') || file.endsWith('.globalValueSet-meta.xml')
    );

    for (const file of valueSets) {
      const fileText = fs.readFileSync(file, 'utf-8');
      if (file.endsWith('.standardValueSet-meta.xml')) {
        const standardValueSet = parseMetadataXml<StandardValueSet>(fileText, 'StandardValueSet');
        const values = Array.isArray(standardValueSet.standardValue)
          ? standardValueSet.standardValue
          : [standardValueSet.standardValue];
        values.forEach((value) => {
          checkForDoubleSpace.call(this, file, fileText, value?.label);
          checkForDoubleSpace.call(this, file, fileText, value?.fullName);
        });
      } else {
        const globalValueSet = parseMetadataXml<GlobalValueSet>(fileText, 'GlobalValueSet');
        const values = Array.isArray(globalValueSet.customValue)
          ? globalValueSet.customValue
          : [globalValueSet.customValue];
        values.forEach((value) => {
          checkForDoubleSpace.call(this, file, fileText, value?.label);
          checkForDoubleSpace.call(this, file, fileText, value?.fullName);
        });
      }
    }

    function checkForDoubleSpace(
      this: NoDoublesSpacesInValueSets,
      file: string,
      fileText: string,
      value?: string
    ): void {
      if (value?.toString().includes('  ')) {
        const location: Location = getLineAndColNumber(this.ruleId, file, fileText, value);
        this.results.push(
          new SingleRuleResult(file, location.startLine, location.endLine, location.startColumn, location.endColumn)
        );
      }
    }
  }
}
