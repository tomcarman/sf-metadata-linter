import * as path from 'node:path';
import fs from 'node:fs';
import { SarifBuilder, SarifRunBuilder, SarifResultBuilder, SarifRuleBuilder } from 'node-sarif-builder';
import type { RuleResults } from '../common/types.js';

export function generateSarifResults(ruleResults: RuleResults): string {
  const filename = 'sf-metadata-linter-results.sarif'; // TODO - make this a flag

  const sarifRun = initSarifRun();
  addRulesToSarifRun(sarifRun, ruleResults);
  addResultsToSarifRun(sarifRun, ruleResults);

  const sarifBuilder = new SarifBuilder();
  sarifBuilder.addRun(sarifRun);
  const results = sarifBuilder.buildSarifJsonString({ indent: false });
  fs.writeFileSync(filename, results);

  return `Results saved to ${filename}`;
}

function initSarifRun(): SarifRunBuilder {
  const sarifRun = new SarifRunBuilder().initSimple({
    toolDriverName: 'sf-metadata-linter',
    toolDriverVersion: '1.0.0',
  });

  return sarifRun;
}

function addRulesToSarifRun(sarifRunBuilder: SarifRunBuilder, ruleResults: RuleResults): void {
  for (const ruleId in ruleResults) {
    if (Object.hasOwn(ruleResults, ruleId)) {
      const rule = ruleResults[ruleId];
      const sarifRule = new SarifRuleBuilder().initSimple({
        ruleId: rule.ruleId,
        shortDescriptionText: rule.shortDescriptionText,
        fullDescriptionText: rule.fullDescriptionText,
      });

      sarifRunBuilder.addRule(sarifRule);
    }
  }
}

function addResultsToSarifRun(sarifRunBuilder: SarifRunBuilder, ruleResults: RuleResults): void {
  for (const ruleId in ruleResults) {
    if (Object.hasOwn(ruleResults, ruleId)) {
      const rule = ruleResults[ruleId];
      for (const result of rule.results) {
        const sarifResult = new SarifResultBuilder().initSimple({
          ruleId: rule.ruleId,
          messageText: rule.shortDescriptionText,
          level: rule.level,
          fileUri: path.relative(process.cwd(), result.filePath).replace(/\\/g, '/'),
          startLine: result.startLine,
          endLine: result.endLine,
        });
        sarifRunBuilder.addResult(sarifResult);
      }
    }
  }
}
