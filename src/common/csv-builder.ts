import fs from 'node:fs';
import { stringify } from 'csv-stringify';
import type { RuleResults } from '../common/types.js';

export function generateCsvResults(ruleResults: RuleResults): string {
  const filename = 'sf-metadata-linter-results.csv'; // TODO - make this a flag
  const writeableStream = fs.createWriteStream(filename);

  const columns = [
    'ruleId',
    'filePath',
    'ruleShortDescription',
    'level',
    'startLine',
    'endLine',
    'startColumn',
    'endColumn',
    'ruleFullDescription',
  ];

  const stringifier = stringify({ header: true, columns });

  for (const ruleId in ruleResults) {
    if (Object.hasOwn(ruleResults, ruleId)) {
      const rule = ruleResults[ruleId];
      for (const result of rule.results) {
        const row = [];
        row.push(
          rule.ruleId,
          result.filePath,
          rule.shortDescriptionText,
          rule.level,
          result.startLine,
          result.endLine,
          result.startColumn,
          result.endColumn,
          rule.fullDescriptionText
        );
        stringifier.write(row);
      }
    }
  }
  stringifier.pipe(writeableStream);

  return `Results saved to ${filename}`;
}
