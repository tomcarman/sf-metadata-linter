import Table from 'cli-table3';
import chalk from 'chalk';
import type { RuleResults } from '../common/types.js';

export function generateTableResults(ruleResults: RuleResults): void {
  const headerValues = ['ruleId', 'filePath', 'level', 'startLn', 'endLn', 'startCol', 'endCol'];
  const headers = headerValues.map((header) => chalk.bold(header));

  const table = new Table({
    head: headers,
    style: {
      head: [],
      border: [],
    },
    colWidths: [40, 100, 10, 10, 10, 10, 10],
  });

  for (const ruleId in ruleResults) {
    if (Object.hasOwn(ruleResults, ruleId)) {
      const rule = ruleResults[ruleId];
      for (const result of rule.results) {
        const row = [];
        row.push(
          rule.ruleId,
          result.filePath,
          rule.level === 'warning'
            ? chalk.yellow(rule.level)
            : rule.level === 'error'
            ? chalk.red(rule.level)
            : rule.level,
          result.startLine,
          result.endLine,
          result.startColumn,
          result.endColumn
        );
        table.push(row);
      }
    }
  }

  process.stdout.write(table.toString());
}
