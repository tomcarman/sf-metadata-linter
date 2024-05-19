import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { fileExists, readAllFiles } from '../util.js';
import { generateSarifResults } from '../../common/sarif-builder.js';
import { generateCsvResults } from '../../common/csv-builder.js';
import { generateTableResults } from '../../common/table-builder.js';
import { ruleClassMap } from '../../common/types.js';
import * as rulesModule from '../../rules/_rules.js';
import type { RuleClasses, RuleResults } from '../../common/types.js';

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
    format: Flags.option({
      summary: messages.getMessage('flags.format.summary'),
      char: 'f',
      options: ['csv', 'sarif', 'table'] as const,
      default: 'table',
    })(),
  };

  public async run(): Promise<MetalintRunResult> {
    const { flags } = await this.parse(MetalintRun);
    if (!(await fileExists(flags['directory']))) throw messages.createError('error.InvalidDir');

    const dir = flags['directory'];
    const format = flags['format'];

    this.spinner.start('Building list of files to lint...');
    const files = (await readAllFiles(dir)) as string[];
    this.spinner.stop();

    const rulesToRun = ['field-should-have-a-description', 'object-should-have-a-description'];

    this.spinner.start('Running rules...');
    const ruleResults = executeRules(rulesToRun, files);
    this.spinner.stop();

    let results = '';

    const formatFunctions = {
      sarif: generateSarifResults,
      csv: generateCsvResults,
      table: generateTableResults,
    };

    this.spinner.start(`Generating ${format}...`);
    results = formatFunctions[format](ruleResults);
    this.spinner.stop();

    // eslint-disable-next-line no-console
    console.log(results);

    return { outcome: 'Complete' };
  }
}

function executeRules(ruleIdsToRun: string[], files: string[]): RuleResults {
  const ruleClasses = rulesModule as RuleClasses;
  const ruleResults: RuleResults = {};

  for (const ruleId of ruleIdsToRun) {
    const RuleClass = ruleClasses[ruleClassMap[ruleId]];
    const rule = new RuleClass();
    rule.setFiles(files);
    rule.execute();
    ruleResults[rule.ruleId] = rule;
  }
  return ruleResults;
}
