import * as fs from 'node:fs';
import { Messages } from '@salesforce/core';
import yaml from 'js-yaml';
import * as yup from 'yup';
import { ConfigFile } from '../common/types.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-metadata-linter', 'metalint.run');

export async function readConfigFile(configFile: string): Promise<ConfigFile> {
  const loadedConfig = yaml.load(fs.readFileSync(configFile, 'utf8'));
  const configSchema = yup.object().shape({
    version: yup.number().required(),
    config: yup.object().shape({
      csvFilename: yup.string(),
      sarifFilename: yup.string(),
      parentDirectory: yup.string(),
    }),
    rules: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        active: yup.boolean().required(),
        level: yup.string().oneOf(['info', 'warning', 'error']).required(),
        option: yup.object().shape({
          name: yup.string(),
          value: yup.mixed(),
        }),
      })
    ),
  });

  try {
    await configSchema.validate(loadedConfig);
    return loadedConfig as ConfigFile;
  } catch (error) {
    throw messages.createError('error.InvalidConfigFile', [(error as Error).message]);
  }
}
