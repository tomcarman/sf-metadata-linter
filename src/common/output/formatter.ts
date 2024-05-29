import type { RuleResults, JsonResults } from '../types.js';
import type { ConfigFile } from '../config-parser.js';
import { generateCsvResults } from './csv.js';
import { generateSarifResults } from './sarif.js';
import { generateTableResults } from './table.js';
import { generateJsonResults } from './json.js';
import { printSummary } from './summary.js';

export class Formatter {
  private files: string[];
  private configFile: ConfigFile;
  private ruleResults: RuleResults;

  public constructor(files: string[], configFile: ConfigFile, ruleResults: RuleResults) {
    this.files = files;
    this.configFile = configFile;
    this.ruleResults = ruleResults;
  }

  public toFormat(format: string): string {
    switch (format) {
      case 'csv':
        return generateCsvResults(this.configFile, this.ruleResults);
      case 'sarif':
        return generateSarifResults(this.configFile, this.ruleResults);
      case 'table':
        return generateTableResults(this.configFile, this.ruleResults);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  public getJson(): JsonResults[] {
    return generateJsonResults(this.ruleResults);
  }

  public getSummary(timeTaken: bigint): string {
    return printSummary(this.files, this.ruleResults, timeTaken);
  }
}
