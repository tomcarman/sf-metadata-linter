import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { readAllFiles } from '../util.js';
import { readConfigFile } from '../../common/config-parser.js';
import { generateSarifResults } from '../../common/sarif-builder.js';
import { generateCsvResults } from '../../common/csv-builder.js';
import { generateTableResults } from '../../common/table-builder.js';
import { ruleClassMap, ConfigFile, RuleProperty, RuleConfig } from '../../common/types.js';
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
    const config = (await readConfigFile(configFile)) as ConfigFile;
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
    const results = resultFormatters[format](ruleResults);
    this.spinner.stop();

    this.log(results);

    return { outcome: results };
  }
}

// TODO move elsewhere?
function executeRules(rulesToRun: string[], ruleConfigMap: Map<string, RuleConfig>, files: string[]): RuleResults {
  const ruleClasses = rulesModule as RuleClasses;
  const ruleResults: RuleResults = {};

  for (const ruleId of rulesToRun) {
    const RuleClass = ruleClasses[ruleClassMap[ruleId]];
    const rule = new RuleClass();
    rule.setFiles(files);
    rule.setPriority(ruleConfigMap.get(ruleId)?.priority as number);
    rule.setRuleProperties(ruleConfigMap.get(ruleId)?.properties as RuleProperty[]);
    rule.execute();
    ruleResults[rule.ruleId] = rule;
  }
  return ruleResults;
}
