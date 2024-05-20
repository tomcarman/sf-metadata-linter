import type { Result } from 'sarif';

export abstract class RuleClass {
  public abstract ruleId: string;
  public abstract shortDescriptionText: string;
  public abstract fullDescriptionText: string;
  public abstract level: Result.level;
  public abstract startLine: number;
  public abstract endLine: number;
  public abstract files: string[];
  public abstract results: SingleRuleResult[];
  public abstract setFiles(files: string[]): void;
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
  [key: string]: new () => RuleClass;
};

export type RuleIdToRuleClassNameMap = {
  [key: string]: string;
};

export const ruleClassMap: RuleIdToRuleClassNameMap = {
  'field-should-have-a-description': 'FieldShouldHaveADescription',
  'object-should-have-a-description': 'ObjectShouldHaveADescription',
};

export type ConfigFile = {
  version: number;
  config: Config;
  rules?: RuleConfig[] | null;
};
export type Config = {
  csvfilename: string;
  sariffilename: string;
};
export type RuleConfig = {
  ruleid: string;
  active: boolean;
  priority: number;
  property?: RuleProperty;
};

export type RuleProperty = {
  name: string;
  value: unknown;
};
