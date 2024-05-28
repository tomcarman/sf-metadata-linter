import type { Result } from 'sarif';
import { RuleOption } from './config-parser.js';

export abstract class RuleClass {
  public files: string[] = [];
  public level: Result.level;
  public ruleProperties?: RuleOption[];
  public results: SingleRuleResult[] = [];

  public abstract ruleId: string;
  public abstract shortDescriptionText: string;
  public abstract fullDescriptionText: string;
  public abstract startLine: number;
  public abstract endLine: number;

  public constructor(files: string[], level: string) {
    this.files = files;
    this.level = level as Result.level;
  }
  public abstract execute(): void;
}

export class SingleRuleResult {
  public filePath: string;
  public startLine: number;
  public endLine: number;
  public startColumn?: number;
  public endColumn?: number;

  public constructor(filePath: string, startLine: number, endLine: number, startColumn?: number, endColumn?: number) {
    this.filePath = filePath;
    this.startLine = startLine;
    this.endLine = endLine;
    this.startColumn = startColumn;
    this.endColumn = endColumn;
  }
}

export type RuleResults = {
  [key: string]: RuleClass;
};

export type RuleClasses = {
  [key: string]: new (files: string[], level?: string, option?: RuleOption[]) => RuleClass;
};

export type RuleIdToRuleClassNameMap = {
  [key: string]: string;
};

export const ruleClassMap: RuleIdToRuleClassNameMap = {
  'field-should-have-a-description': 'FieldShouldHaveADescription',
  'object-should-have-a-description': 'ObjectShouldHaveADescription',
  'field-description-minimum-length': 'FieldDescriptionMinimumLength',
};

// export type ConfigFile = {
//   version: number;
//   config: Config;
//   rules: RuleConfig[];
// };
// export type Config = {
//   csvFilename: string;
//   sarifFilename: string;
//   parentDirectory: string;
// };
// export type RuleConfig = {
//   name: string;
//   active: boolean;
//   level: string;
//   options?: RuleOption[] | null;
// };

// export type RuleOption = {
//   name: string;
//   value: unknown;
// };

export type JsonResults = {
  ruleId: string;
  level: string;
  ruleShortDescription: string;
  ruleFullDescription: string;
  results: SingleRuleResult[];
};
