// import Table from 'cli-table3';
import chalk from 'chalk';
import type { RuleResults } from '../common/types.js';

export function printSummary(files: string[], ruleResults: RuleResults): string {
  let warnings: number = 0;
  let errors: number = 0;
  const filesWithWarnings = new Set();
  const filesWithErrors = new Set();

  for (const ruleId in ruleResults) {
    if (Object.hasOwn(ruleResults, ruleId)) {
      const rule = ruleResults[ruleId];

      if (rule.level === 'warning') {
        warnings += rule.results.length;
        for (const result of rule.results) {
          filesWithWarnings.add(result.filePath);
        }
      }
      if (rule.level === 'error') {
        errors += rule.results.length;
        for (const result of rule.results) {
          filesWithErrors.add(result.filePath);
        }
      }
    }
  }

  const metadataScanned = `${chalk.blue(files.length)} metadata files were scanned`;

  const passedOutput = (): string => {
    const passed = files.length - warnings - errors;
    return passed > 0
      ? `${chalk.bold.green('Passed:  ')} ${chalk.bold(passed.toString())} file(s)`
      : `${chalk.bold.green('Passed:')} none`;
  };
  const warningOutput = (): string =>
    warnings > 0
      ? `${chalk.bold.yellow('Warnings:')} ${chalk.bold(warnings)} across ${chalk.bold(filesWithWarnings.size)} file(s)`
      : `${chalk.bold.yellow('Warnings:')} none`;

  const errorOutput = (): string =>
    errors > 0
      ? `${chalk.bold.red('Errors:  ')} ${chalk.bold(errors)} across ${chalk.bold(filesWithErrors.size)} file(s)`
      : `${chalk.bold.red('Errors:  ')} none`;

  const summary: string = `
  --- Results Summary ---

  ${metadataScanned}

  ${passedOutput()}
  ${warningOutput()}
  ${errorOutput()}`;

  return summary;
}
