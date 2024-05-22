import type { Result } from 'sarif';

export abstract class RuleClass {
  public files: string[] = [];
  public ruleProperties?: RuleProperty[];
  public results: SingleRuleResult[] = [];

  public abstract ruleId: string;
  public abstract shortDescriptionText: string;
  public abstract fullDescriptionText: string;
  public abstract level: Result.level;
  public abstract startLine: number;
  public abstract endLine: number;

  public setFiles(files: string[]): void {
    this.files = files;
  }
  public setRuleProperties(ruleProperties: RuleProperty[]): void {
    this.ruleProperties = ruleProperties;
  }
  public setPriority(priority: number): void {
    switch (priority) {
      case 1:
        this.level = 'error';
        break;
      case 2:
        this.level = 'warning';
        break;
      case 3:
        this.level = 'note';
        break;
      default:
        this.level = 'warning';
    }
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
  [key: string]: new () => RuleClass;
};

export type RuleIdToRuleClassNameMap = {
  [key: string]: string;
};

export const ruleClassMap: RuleIdToRuleClassNameMap = {
  'field-should-have-a-description': 'FieldShouldHaveADescription',
  'object-should-have-a-description': 'ObjectShouldHaveADescription',
  'field-description-minimum-length': 'FieldDescriptionMinimumLength',
};

export type ConfigFile = {
  version: number;
  config: Config;
  rules: RuleConfig[];
};
export type Config = {
  csvfilename: string;
  sariffilename: string;
};
export type RuleConfig = {
  name: string;
  active: boolean;
  priority: number;
  properties?: RuleProperty[] | null;
};

export type RuleProperty = {
  name: string;
  value: unknown;
};
