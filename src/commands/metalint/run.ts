import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { readAllFiles } from '../util.js';
import { readConfigFile } from '../../common/config-parser.js';
import { generateSarifResults } from '../../common/sarif-builder.js';
import { generateCsvResults } from '../../common/csv-builder.js';
import { generateTableResults } from '../../common/table-builder.js';
import { printSummary } from '../../common/summary-builder.js';
import { ruleClassMap, RuleProperty, RuleConfig } from '../../common/types.js';
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
    config: Flags.file({
      summary: messages.getMessage('flags.config.summary'),
      char: 'c',
      required: true,
      exists: true,
    }),
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
    const configFile = flags['config'];
    const dir = flags['directory'];
    const format = flags['format'];

    this.spinner.start('Reading config file...');
    const config = await readConfigFile(configFile);
    const rulesToRun = config.rules.filter((rule) => rule.active).map((rule) => rule.name);
    const ruleConfigMap: Map<string, RuleConfig> = new Map();
    config.rules.filter((rule) => rule.active).forEach((rule) => ruleConfigMap.set(rule.name, rule));
    this.spinner.stop();

    this.spinner.start('Building list of files to lint...');
    const files = (await readAllFiles(dir)) as string[];
    this.spinner.stop();

    this.spinner.start('Running rules...');
    const ruleResults = executeRules(rulesToRun, ruleConfigMap, files);
    this.spinner.stop();

    this.spinner.start(`Generating ${format}...`);
    const resultFormatters = {
      sarif: generateSarifResults,
      csv: generateCsvResults,
      table: generateTableResults,
    };
    const results = resultFormatters[format](config, ruleResults);
    this.spinner.stop();

    this.log(results);

    const summary = printSummary(files, ruleResults);
    this.log(summary);

    return { outcome: results };
  }
}

// TODO move elsewhere?
function executeRules(rulesToRun: string[], ruleConfigMap: Map<string, RuleConfig>, files: string[]): RuleResults {
  const ruleClasses = rulesModule as RuleClasses;
  const ruleResults: RuleResults = {};

  for (const ruleId of rulesToRun) {
    console.log('processing ruleId: ', ruleId);

    /* Todo:
    - Create a "RuleDefinition" class/file that contains all the metadata for a rule
      - Include the rule class name - then that can be used for the dynamic import, getting rid of the need for the ruleClassMap? tbc
      - Include the name, description, default priority, start/end line
    - Create new RuleOptions type - key/value pairs for rule options AND the priority (replaces RuleProperty)
    - Set default RuleClass constructor to RuleClass(ruleDefinition, files, options) (also update RuleClasses type). It will:
      - set the metadata from the ruleDefinition
      - set the files from the files
      - set ONLY the priority from the options (as thats the only guaranteed option)
    - For rules that have options, override the default constructor to set additional options specific to that rule
    */

    const RuleClass = ruleClasses[ruleClassMap[ruleId]];
    const rule = new RuleClass(files);
    rule.setPriority(ruleConfigMap.get(ruleId)?.priority as number);
    rule.setRuleProperties(ruleConfigMap.get(ruleId)?.properties as RuleProperty[]);
    rule.execute();
    ruleResults[rule.ruleId] = rule;
  }
  return ruleResults;
}
