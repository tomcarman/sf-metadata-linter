import * as fs from 'node:fs';
import { Messages } from '@salesforce/core';
import yaml from 'js-yaml';
import { z } from 'zod';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-metadata-linter', 'metalint.run');

export const configSchema = z
  .object({
    csvFilename: z.string().optional(),
    sarifFilename: z.string().optional(),
    parentDirectory: z.string().optional(),
  })
  .optional();

export const ruleOptionSchema = z.object({
  name: z.string(),
  value: z.unknown(),
});

export const ruleSchema = z.object({
  name: z.string(),
  active: z.boolean(),
  level: z.enum(['info', 'warning', 'error']),
  options: z.array(ruleOptionSchema).optional(),
});

export const configFileSchema = z.object({
  version: z.number(),
  config: configSchema,
  rules: z.array(ruleSchema),
});

export type ConfigFile = z.infer<typeof configFileSchema>;
export type Config = z.infer<typeof configSchema>;
export type RuleOption = z.infer<typeof ruleOptionSchema>;
export type RuleConfig = z.infer<typeof ruleSchema>;

export function readConfigFile(configFile: string): ConfigFile {
  const loadedConfig = yaml.load(fs.readFileSync(configFile, 'utf8'));
  try {
    return configFileSchema.parse(loadedConfig);
  } catch (error) {
    throw messages.createError('error.InvalidConfigFile', [(error as Error).message]);
  }
}
