import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';
import { parseMetadataXml } from '../commands/util.js';

export default class FlowDescriptionMinimumLength extends RuleClass {
  public minimumLength = 50; // Default value

  public ruleId: string = 'flow-description-minimum-length';
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
    return `Flow description does not meet the minimum length (${this.minimumLength})`;
  }
  public get fullDescriptionText(): string {
    return `A Flow should have a description, describing how the Flow is used. The description should be at least ${this.minimumLength} characters long.`;
  }

  public execute(): void {
    const flows = this.files.filter((file) => file.endsWith('.flow-meta.xml'));

    const ruleViolations = flows.filter((file) => {
      const fileText = fs.readFileSync(file, 'utf-8');
      const flow = parseMetadataXml<Flow>(fileText, 'Flow');
      if (flow.description) {
        return flow.description.length < this.minimumLength;
      }
    });

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
