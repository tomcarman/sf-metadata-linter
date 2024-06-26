import * as path from 'node:path';
import { readdir } from 'node:fs/promises';
import { Messages } from '@salesforce/core';
import { XMLParser } from 'fast-xml-parser';
import { encode } from 'html-entities';
import indexToPosition from 'index-to-position';
import { warningsCache } from '../commands/metalint/run.js';
import type { Location } from './types.js';

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

export function normaliseNewlines(fileText: string): string {
  return fileText.replace(/\r\n/g, '\n');
}

export function getLineAndColNumber(ruleId: string, file: string, fileText: string, value: string): Location {
  let location: Location;

  try {
    // Metdata can contain windows-stye \r\n newlines, which get lost when parsing/casting the metadata, so we need to normalise the file text
    const normalisedFileText = normaliseNewlines(fileText);
    const encodedValue = encode(value);
    const startIndex = normalisedFileText.indexOf(encodedValue);
    const startPosition = indexToPosition(normalisedFileText, startIndex, { oneBased: true });
    const endIndex = startIndex + encodedValue.length;
    const endPosition = indexToPosition(normalisedFileText, endIndex, { oneBased: true });
    location = {
      startLine: startPosition.line,
      endLine: endPosition.line,
      startColumn: startPosition.column,
      endColumn: endPosition.column,
    };
  } catch (error) {
    warningsCache.push(messages.createWarning('warning.UnableToFindViolationLocation', [ruleId, file, value]));
    location = { startLine: 0, endLine: 0, startColumn: 0, endColumn: 0 };
  }
  return location;
}

export function getCustomMetadata(files: string[], types?: string[], excludeNamespaces?: string[]): string[] {
  const standardMetadataTypes = ['object', 'field', 'tab']; // This list is any metadata type that can be "stanadrd", and needs additional filtering based on suffix.
  const customMetadataSuffixes = ['__c', '__e', '__b', '__x'];

  return files.filter((file) => {
    // Filter based on the types option
    if (types && types.length !== 0) {
      const typeMatch = types.some((type) => file.endsWith(`.${type}-meta.xml`));
      if (!typeMatch) return false;
    }

    // Filter based on the exclude-namespaces option
    if (excludeNamespaces && excludeNamespaces.length !== 0) {
      const namespaceExcluded = excludeNamespaces.some((namespace) => file.includes(namespace));
      if (namespaceExcluded) return false;
    }

    // Filter out standard metadata
    const standardMetadata = standardMetadataTypes.some((fileType) => file.endsWith(`.${fileType}-meta.xml`));
    if (standardMetadata) {
      return customMetadataSuffixes.some((suffix) => file.includes(suffix));
    }

    // If none of the above conditions matched, the file passes the filter (e.g. it's a custom metadata file defined by its extension - .listView-meta.xml, .layout-meta.xml etc)
    return true;
  });
}
