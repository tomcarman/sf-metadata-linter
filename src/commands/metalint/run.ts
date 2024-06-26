import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, StructuredMessage } from '@salesforce/core';
// import type { StructuredMessage } from '@salesforce/core';
import { readAllFiles } from '../../common/util.js';
import { readConfigFile } from '../../common/config-parser.js';
import { Formatter } from '../../common/output/formatter.js';
import { RulesEngine } from '../../common/rules-engine.js';
import type { JsonResults } from '../../common/types.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-metadata-linter', 'metalint.run');

export const warningsCache: StructuredMessage[] = [];

export type MetalintRunResult = {
  outcome: JsonResults[];
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
    const start = process.hrtime.bigint();

    const { flags } = await this.parse(MetalintRun);
    const configFile = flags['config'];
    const dir = flags['directory'];
    const format = flags['format'];

    this.spinner.start('Reading config file...');
    const config = readConfigFile(configFile);
    this.spinner.stop();

    this.spinner.start('Building list of files to lint...');
    const files = (await readAllFiles(dir)) as string[];
    this.spinner.stop();

    this.spinner.start('Running rules...');
    const rulesEngine = new RulesEngine(config, files);
    rulesEngine.executeRules();
    const ruleResults = rulesEngine.ruleResults;
    this.spinner.stop();

    this.spinner.start(`Generating ${format}...`);
    const formatter = new Formatter(files, config, ruleResults);
    const results = formatter.toFormat(format);
    this.spinner.stop();
    this.log('\n');
    this.log(results);

    const timeTaken = process.hrtime.bigint() - start;
    const summary = formatter.getSummary(timeTaken);
    this.log(summary);

    for (const warning of warningsCache) {
      this.log('\n');
      this.warn(warning);
    }

    return { outcome: formatter.getJson() };
  }
}
