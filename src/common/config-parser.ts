import * as fs from 'node:fs';
import yaml from 'js-yaml';
import * as yup from 'yup';
import { ConfigFile } from '../common/types.js';

export async function readConfigFile(): Promise<void> {
  const loadedConfig = yaml.load(fs.readFileSync('demo/config.yaml', 'utf8'));

  const configSchema = yup.object().shape({
    version: yup.number().required(),
    config: yup.object().shape({
      csvfilename: yup.string(),
      sariffilename: yup.string(),
    }),
    rules: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        active: yup.boolean().required(),
        priority: yup.number().required(),
        property: yup.object().shape({
          name: yup.string(),
          value: yup.mixed(),
        }),
      })
    ),
  });

  try {
    await configSchema.validate(loadedConfig);
    const config = loadedConfig as ConfigFile;
    // eslint-disable-next-line no-console
    console.log(config);
  } catch (error) {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  }
}
