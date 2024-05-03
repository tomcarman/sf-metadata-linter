import fs from 'node:fs';
import { readdir } from 'node:fs/promises';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-metadata-linter', 'metalint.utils');

export async function fileExists(file: string): Promise<boolean> {
  try {
    await fs.promises.access(file);
    return true;
  } catch {
    return false;
  }
}

export async function readAllFiles(dir: string): Promise<string[] | undefined> {
  try {
    const files = await readdir(dir, { recursive: true });
    return files;
  } catch (error) {
    if (error instanceof Error) {
      throw messages.createError('error.CantReadDir', [error.message]);
    }
  }
}
