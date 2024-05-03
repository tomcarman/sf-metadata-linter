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
    // eslint-disable-next-line no-console
    // console.log(files);

    const fieldsWithoutDescriptions = fieldsMustHaveDescriptions(files);
    // eslint-disable-next-line no-console
    console.log(fieldsWithoutDescriptions);

    return { outcome: 'Complete' };
  }
}
