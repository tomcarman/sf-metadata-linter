import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import type { Location } from '../common/types.js';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';
import { parseMetadataXml, getLineAndColNumber } from '../common/util.js';

export default class DescriptionMinLengthOnFlows extends RuleClass {
  public minimumLength = 50; // Default value

  public ruleId: string = 'description-min-length-on-flows';
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
    return `Flow descriptions should be at least ${this.minimumLength} characters long.`;
  }
  public get fullDescriptionText(): string {
    return `Flow descriptions should be at least ${this.minimumLength} characters long. Update the 'Description' field on the flow.`;
  }

  public execute(): void {
    const flows = this.files.filter((file) => file.endsWith('.flow-meta.xml'));

    for (const file of flows) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const flow = parseMetadataXml<Flow>(fileText, 'Flow');
      if (flow.description && flow.description.length < this.minimumLength) {
        const location: Location = getLineAndColNumber(this.ruleId, file, fileText, flow.description);
        this.results.push(
          new SingleRuleResult(file, location.startLine, location.endLine, location.startColumn, location.endColumn)
        );
      }
    }
  }
}
