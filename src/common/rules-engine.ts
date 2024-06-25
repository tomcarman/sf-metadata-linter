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
  'field-should-have-a-description': 'FieldShouldHaveADescription',
  'object-should-have-a-description': 'ObjectShouldHaveADescription',
  'flow-should-have-a-description': 'FlowShouldHaveADescription',
  'validation-rule-should-have-a-description': 'ValidationRuleShouldHaveADescription',
  'field-description-minimum-length': 'FieldDescriptionMinimumLength',
  'object-description-minimum-length': 'ObjectDescriptionMinimumLength',
  'flow-description-minimum-length': 'FlowDescriptionMinimumLength',
  'validation-rule-description-minimum-length': 'ValidationRuleDescriptionMinimumLength',
  'metadata-should-have-prefix': 'MetadataShouldHavePrefix',
  'metadata-should-not-have-prefix': 'MetadataShouldNotHavePrefix',
};

export class RulesEngine {
  public ruleResults: RuleResults;

  private rulesToRun: string[];
  private ruleConfigMap: Map<string, RuleConfig>;
  private files: string[];

  public constructor(config: ConfigFile, files: string[]) {
    this.files = files;
    this.ruleResults = {}; // is best place to init?
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
