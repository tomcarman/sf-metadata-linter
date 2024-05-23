import Table from 'cli-table3';
import chalk from 'chalk';
import type { ConfigFile, RuleResults } from '../common/types.js';

export function generateTableResults(configFile: ConfigFile, ruleResults: RuleResults): string {
  const parentdir = configFile.config.parentdir;

  const headerValues = ['ruleId', 'filePath', 'level', 'line', 'col'];
  const headers = headerValues.map((header) => chalk.bold(header));

  const table = new Table({
    head: headers,
    style: {
      head: [],
      border: [],
    },
    colWidths: [40, 80, 10, 10, 10],
  });

  for (const ruleId in ruleResults) {
    if (Object.hasOwn(ruleResults, ruleId)) {
      const rule = ruleResults[ruleId];
      for (const result of rule.results) {
        const row = [];
        row.push(
          rule.ruleId,
          result.filePath.split(parentdir).pop(),
          rule.level === 'warning'
            ? chalk.yellow(rule.level)
            : rule.level === 'error'
            ? chalk.red(rule.level)
            : rule.level,
          result.startLine && result.endLine ? `${result.startLine},${result.endLine}` : '',
          result.startColumn && result.endColumn ? `${result.startColumn},${result.endColumn}` : ''
        );
        table.push(row);
      }
    }
  }

  return table.toString();
}
