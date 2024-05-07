// import { pathToFileURL } from 'node:url';
import * as path from 'node:path';
import { SarifBuilder, SarifRunBuilder, SarifResultBuilder, SarifRuleBuilder } from 'node-sarif-builder';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { fileExists, readAllFiles } from '../util.js';
import { fieldsMustHaveDescriptions } from '../../rules/fields-must-have-descriptions.js';

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

    // Run rules
    const fieldsWithoutDescriptions = fieldsMustHaveDescriptions(files);
    // eslint-disable-next-line no-console
    console.log(fieldsWithoutDescriptions);

    // Setup sarif builder, add rules
    const sarifBuilder = new SarifBuilder();
    const sarifRunBuilder = new SarifRunBuilder().initSimple({
      toolDriverName: 'sf-metadata-linter',
      toolDriverVersion: '1.0.0',
    });

    const sarifRuleBuilder = new SarifRuleBuilder().initSimple({
      ruleId: 'fields-must-have-descriptions',
      shortDescriptionText: 'Fields must have descriptions',
      helpUri: 'http://www.google.com',
    });
    sarifRunBuilder.addRule(sarifRuleBuilder);

    const sarifResultBuilder = new SarifResultBuilder();

    for (const field of fieldsWithoutDescriptions) {
      // let path = process.env.SARIF_URI_ABSOLUTE ? pathToFileURL(field) : path.relative(process.cwd(), field).replace(/\\/g, '/') as const

      const sarifResultInit = {
        ruleId: 'fields-must-have-descriptions',
        messageText: 'Field is missing a description',
        level: 'error' as const,
        // fileUri: pathToFileURL(field).toString(),
        fileUri: path.relative(process.cwd(), field).replace(/\\/g, '/'),
      };

      sarifResultBuilder.initSimple(sarifResultInit);
      sarifRunBuilder.addResult(sarifResultBuilder);
    }

    sarifBuilder.addRun(sarifRunBuilder);
    const sarifResults = sarifBuilder.buildSarifJsonString({ indent: false });
    // eslint-disable-next-line no-console
    console.log(sarifResults);

    return { outcome: 'Complete' };
  }
}
