import * as path from 'node:path';
import { SarifBuilder, SarifRunBuilder, SarifResultBuilder, SarifRuleBuilder } from 'node-sarif-builder';
import type { RuleResults } from '../common/types.js';

export function generateSarifResults(ruleResults: RuleResults): string {
  const sarifRun = initSarifRun();
  addRulesToSarifRun(sarifRun, ruleResults);
  addResultsToSarifRun(sarifRun, ruleResults);

  const sarifBuilder = new SarifBuilder();
  sarifBuilder.addRun(sarifRun);
  return sarifBuilder.buildSarifJsonString({ indent: false });
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
          level: 'error' as const,
          fileUri: path.relative(process.cwd(), result.filePath).replace(/\\/g, '/'),
          startLine: result.startLine,
          endLine: result.endLine,
        });
        sarifRunBuilder.addResult(sarifResult);
      }
    }
  }
}

// RunBuilder
// RuleBuilder -  added to RunBuilder
// ResultNBuilder - added to RunBuilder
// RunBuilder added to SarifBuilder

function initSarifRun(): SarifRunBuilder {
  const sarifRun = new SarifRunBuilder().initSimple({
    toolDriverName: 'sf-metadata-linter',
    toolDriverVersion: '1.0.0',
  });

  return sarifRun;
}

// const sarifResultBuilder = new SarifResultBuilder();
// for (const rule of ruleResults) {
//   for (const field of rule) {
//     // Dumb but fine for now
//     const sarifResultInit = {
//       ruleId: 'fields-should-have-a-description',
//       messageText: 'Custom Fields should have description.',
//       level: 'error' as const,
//       fileUri: path.relative(process.cwd(), field).replace(/\\/g, '/'),
//       startLine: 3,
//       endLine: 3,
//     };
//     sarifResultBuilder.initSimple(sarifResultInit);
//     sarifRunBuilder.addResult(sarifResultBuilder);
//   }
// }

// const sarifRuleBuilder = new SarifRuleBuilder().initSimple({
//   ruleId: 'field-should-have-a-description',
//   shortDescriptionText: 'Custom Fields should have description.',
//   fullDescriptionText: 'A Custom Field should have a description, describing how the field is used.',
// });

// sarifRunBuilder.addRule(sarifRuleBuilder);

// const sarifResultBuilder = new SarifResultBuilder();

// for (const rule of ruleResults) {
//   for (const field of rule) {
//     // Dumb but fine for now
//     const sarifResultInit = {
//       ruleId: 'fields-should-have-a-description',
//       messageText: 'Custom Fields should have description.',
//       level: 'error' as const,
//       fileUri: path.relative(process.cwd(), field).replace(/\\/g, '/'),
//       startLine: 3,
//       endLine: 3,
//     };
//     sarifResultBuilder.initSimple(sarifResultInit);
//     sarifRunBuilder.addResult(sarifResultBuilder);
//   }
// }

// sarifBuilder.addRun(sarifRunBuilder);
// const sarifResults = sarifBuilder.buildSarifJsonString({ indent: false });
// // eslint-disable-next-line no-console
// console.log(sarifResults);
