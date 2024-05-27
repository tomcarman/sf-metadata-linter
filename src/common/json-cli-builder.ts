import type { JsonResults, RuleResults } from '../common/types.js';

export function generateJsonResults(ruleResults: RuleResults): JsonResults[] {
  const jsonResults: JsonResults[] = [];

  for (const ruleId in ruleResults) {
    if (Object.hasOwn(ruleResults, ruleId)) {
      const rule = ruleResults[ruleId];
      jsonResults.push({
        ruleId: rule.ruleId,
        level: rule.level,
        ruleShortDescription: rule.shortDescriptionText,
        ruleFullDescription: rule.fullDescriptionText,
        results: rule.results,
      });
    }
  }
  return jsonResults;
}
