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

export function getCustomMetada(files: string[], types?: string[], excludeNamespaces?: string[]): string[] {
  let filteredFiles = files;

  const filesToFilterStandard = ['object', 'field', 'tab']; // This list is any metadata type that can be "stanadrd", and needs additional filtering based on suffix.
  const customSuffixes = ['__c', '__e', '__b', '__x'];

  // Filter metadata files based on the types option
  if (types && types.length !== 0) {
    filteredFiles = files.filter((file) => {
      for (const fileType of types) {
        if (file.endsWith(`.${fileType}-meta.xml`)) {
          return true;
        }
      }
    });
  }
  // Filter metadata files based on the exclude-namespaces option
  if (excludeNamespaces && excludeNamespaces.length !== 0) {
    filteredFiles = filteredFiles.filter((file) => {
      for (const excludeNamespace of excludeNamespaces) {
        if (!file.includes(excludeNamespace)) {
          return true;
        }
      }
    });
  }

  // Filter out any standard metadata files
  filteredFiles = filteredFiles.filter((file) => {
    let matched = false;
    for (const fileType of filesToFilterStandard) {
      if (file.endsWith(`.${fileType}-meta.xml`)) {
        matched = true;
        for (const suffix of customSuffixes) {
          if (file.includes(suffix)) {
            return true;
          }
        }
      }
    }
    if (!matched) {
      return true;
    }
  });

  return filteredFiles;
}
