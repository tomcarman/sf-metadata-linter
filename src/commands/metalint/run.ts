import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { fileExists, readAllFiles } from '../util.js';
import * as rulesModule from '../../rules/index.js';
import type { RuleClass, RuleResults } from '../../common/types.js';
import { generateSarifResults } from '../../common/sarif-builder.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-metadata-linter', 'metalint.run');

export type MetalintRunResult = {
  outcome: string;
};

export default class MetalintRun extends SfCommand<MetalintRunResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    directory: Flags.directory({
      summary: messages.getMessage('flags.directory.summary'),
      char: 'd',
      required: true,
      exists: true,
    }),
  };

  public async run(): Promise<MetalintRunResult> {
    const { flags } = await this.parse(MetalintRun);
    if (!(await fileExists(flags['directory']))) throw messages.createError('error.InvalidDir');

    const dir = flags['directory'];

    this.spinner.start('Building list of files to lint...');
    const files = (await readAllFiles(dir)) as string[];
    this.spinner.stop();

    const rulesToRun = ['field-should-have-a-description'];

    this.spinner.start('Running rules...');
    const ruleResults = executeRules(rulesToRun, files);
    this.spinner.stop();

    this.spinner.start('Generating SARIF...');
    const sarifResults = generateSarifResults(ruleResults);
    this.spinner.stop();

    // eslint-disable-next-line no-console
    console.log(sarifResults);

    return { outcome: 'Complete' };
  }
}

type RuleClassMap = {
  [key: string]: string;
};

const ruleClassMap: RuleClassMap = {
  'field-should-have-a-description': 'FieldShouldHaveADescription',
};

type Rules = {
  [key: string]: new () => RuleClass;
};
const rules = rulesModule as Rules;

function executeRules(rulesToRun: string[], files: string[]): RuleResults {
  const allRuleResults: RuleResults = {};

  for (const ruleName of rulesToRun) {
    const Rule = rules[ruleClassMap[ruleName]];
    const ruleInstance = new Rule();
    ruleInstance.setFiles(files);
    ruleInstance.execute();
    allRuleResults[ruleInstance.ruleId] = ruleInstance;
  }
  return allRuleResults;
}

// await function executeRules(rulesToRun: string[], files: string[]): Promise<string[][]> {

// const ruleToRun = config['test-rule'];
// const ruleToRun2 = 'TestRule'

// const Rule = rulesModule[ruleToRun];  // eslint-disable-line
// const ruleInstance = new Rule(); // eslint-disable-line
// ruleInstance.setFiles(files);  // eslint-disable-line
// ruleResults.push(ruleInstance.execute());  // eslint-disable-line

// await Promise.all(
//   rulesToRun.map(async (ruleName) => {
//     const aRule = (await import(`../../rules/${ruleName}.ts`)).rule; // eslint-disable-line
//     aRule.setFiles(files); // eslint-disable-line
//     ruleResults.push(aRule.execute()); // eslint-disable-line

//   })
// );

// const ruleInstance = new config[ruleName].execute();

// const rule = (await import(`../../rules/${ruleName}.ts`)) as RuleClass; // eslint-disable-line
// const ruleInstance = new RuleClass(files); // eslint-disable-line
// ruleResults.push(ruleInstance.execute()); // eslint-disable-line

// rules2[rulesName]

// const Rule = (await import(`../../rules/${ruleName}.ts`)).rule;
// const aRule = new Rule();
// aRule.setFiles(files);
// ruleResults.push(aRule.execute());
