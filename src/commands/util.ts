import * as path from 'node:path';
import { readdir } from 'node:fs/promises';
import { Messages } from '@salesforce/core';
import { XMLParser } from 'fast-xml-parser';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sf-metadata-linter', 'metalint.utils');

export async function readAllFiles(dir: string): Promise<string[] | undefined> {
  try {
    const files = await readdir(dir, { recursive: true });
    const fullPathFiles = files.filter((file) => file.endsWith('.xml')).map((file) => path.join(dir, file));
    return fullPathFiles;
  } catch (error) {
    if (error instanceof Error) {
      throw messages.createError('error.InvalidDirectory', [error.message]);
    }
  }
}

export function parseMetadataXml<T>(fileString: string, mainNodeName: string): T {
  const parser = new XMLParser({ ignoreDeclaration: true });
  return (parser.parse(fileString) as unknown as { [key: string]: T })[mainNodeName];
}
