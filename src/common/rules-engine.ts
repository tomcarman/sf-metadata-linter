import * as rulesModule from '../rules/_rules.js';
import { RuleClass, RuleResults } from './types.js';
import type { ConfigFile, RuleConfig, RuleOption } from './config-parser.js';

export type RuleClasses = {
  [key: string]: new (files: string[], level?: string, option?: RuleOption[]) => RuleClass;
};

export type RuleIdToRuleClassNameMap = {
  [key: string]: string;
};

const ruleClassMap: RuleIdToRuleClassNameMap = {
  'no-missing-description-on-fields': 'NoMissingDescriptionOnFields',
  'no-missing-description-on-objects': 'NoMissingDescriptionOnObjects',
  'no-missing-description-on-flows': 'NoMissingDescriptionOnFlows',
  'no-missing-description-on-validation-rules': 'NoMissingDescriptionOnValidationRules',
  'description-min-length-on-fields': 'DescriptionMinLengthOnFields',
  'description-min-length-on-objects': 'DescriptionMinLengthOnObjects',
  'description-min-length-on-flows': 'DescriptionMinLengthOnFlows',
  'description-min-length-on-validation-rules': 'DescriptionMinLengthOnValidationRules',
  'no-missing-prefix-on-metadata': 'NoMissingPrefixOnMetadata',
  'no-prefix-on-metadata': 'NoPrefixOnMetadata',
  'error-message-min-length-on-validation-rules': 'ErrorMessageMinLengthOnValidationRules',
  'no-double-spaces-in-picklist-fields': 'NoDoubleSpacesInPicklistFields',
  'no-double-spaces-in-value-sets': 'NoDoublesSpacesInValueSets',
};

export class RulesEngine {
  public ruleResults: RuleResults;

  private rulesToRun: string[];
  private ruleConfigMap: Map<string, RuleConfig>;
  private files: string[];

  public constructor(config: ConfigFile, files: string[]) {
    this.files = files;
    this.ruleResults = {};
    this.rulesToRun = config.rules.filter((rule) => rule.active).map((rule) => rule.name);
    this.ruleConfigMap = new Map();
    config.rules.filter((rule) => rule.active).forEach((rule) => this.ruleConfigMap.set(rule.name, rule));
  }

  public executeRules(): void {
    const ruleClasses = rulesModule as RuleClasses;

    for (const ruleId of this.rulesToRun) {
      const RuleClassInstance = ruleClasses[ruleClassMap[ruleId]];
      const ruleLevel = this.ruleConfigMap.get(ruleId)?.level;
      const ruleOptions = this.ruleConfigMap.get(ruleId)?.options as RuleOption[];
      const rule = new RuleClassInstance(this.files, ruleLevel, ruleOptions);

      rule.execute();
      this.ruleResults[rule.ruleId] = rule;
    }
  }
}
