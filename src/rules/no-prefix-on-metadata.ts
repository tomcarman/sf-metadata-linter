import { RuleClass, SingleRuleResult } from '../common/types.js';
import { RuleOption } from '../common/config-parser.js';
import { getCustomMetadata } from '../common/util.js';

export default class NoPrefixOnMetadata extends RuleClass {
  public prefixes: string[] = [];
  public types: string[] = [];
  public excludeNamespaces: string[] = [];

  public ruleId: string = 'no-prefix-on-metadata';
  public shortDescriptionText = 'Metadata API names should not have a prefix.';
  public startLine = 1;
  public endLine = 1;

  public constructor(files: string[], level: string, options: RuleOption[]) {
    super(files, level);
    if (options) {
      const prefixes = options.find((ruleOption) => ruleOption.name === 'prefixes');
      if (prefixes) {
        const prefixesString = prefixes.value as string;
        this.prefixes = prefixesString.split(/\s*,\s*/);
      }
      const types = options.find((ruleOption) => ruleOption.name === 'types');
      if (types) {
        const typeString = types.value as string;
        this.types = typeString.split(/\s*,\s*/);
      }
      const excludeNamespaces = options.find((ruleOption) => ruleOption.name === 'exclude-namespaces');
      if (excludeNamespaces) {
        const excludeNamespaceString = excludeNamespaces.value as string;
        this.excludeNamespaces = excludeNamespaceString.split(/\s*,\s*/);
      }
    }
  }

  public get fullDescriptionText(): string {
    if (this.types.length > 0) {
      return `Metadata API names should not have a prefix of: ${this.prefixes.join(
        ', '
      )}. This applies to metadata of types: ${this.types.join(', ')}. Remove the prefix from the API name.`;
    } else {
      return `Metadata API names should not be prefixed with any of the following: ${this.prefixes.join(
        ', '
      )}. Remove the prefix from the API name.`;
    }
  }
  public execute(): void {
    const filteredFiles = getCustomMetadata(this.files, this.types, this.excludeNamespaces);
    const ruleViolations = [];

    for (const file of filteredFiles) {
      const filename = file.substring(file.lastIndexOf('/') + 1);
      for (const prefix of this.prefixes) {
        if (filename.startsWith(prefix)) {
          ruleViolations.push(file);
        }
      }
    }

    for (const ruleViolation of ruleViolations) {
      this.results.push(new SingleRuleResult(ruleViolation, this.startLine, this.endLine));
    }
  }
}
