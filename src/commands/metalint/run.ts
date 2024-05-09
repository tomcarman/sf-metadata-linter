// import { pathToFileURL } from 'node:url';
import * as path from 'node:path';
import { SarifBuilder, SarifRunBuilder, SarifResultBuilder, SarifRuleBuilder } from 'node-sarif-builder';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { fileExists, readAllFiles } from '../util.js';
import { fieldsMustHaveDescriptions } from '../../rules/field-should-have-a-description.js';

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
      ruleId: 'field-should-have-a-description',
      shortDescriptionText: 'Custom Fields should have description.',
      fullDescriptionText: 'A Custom Field should have a description, describing how the field is used.',
    });
    sarifRunBuilder.addRule(sarifRuleBuilder);

    const sarifResultBuilder = new SarifResultBuilder();

    for (const field of fieldsWithoutDescriptions) {
      const sarifResultInit = {
        ruleId: 'fields-should-have-a-description',
        messageText: 'Custom Fields should have description.',
        level: 'error' as const,
        fileUri: path.relative(process.cwd(), field).replace(/\\/g, '/'),
        startLine: 3,
        endLine: 3,
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
