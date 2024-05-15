export abstract class RuleClass {
  public ruleId: string = '';
  public shortDescriptionText: string = '';
  public fullDescriptionText: string = '';
  public startLine: number = 0;
  public endLine: number = 0;
  public files: string[] = [];
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
