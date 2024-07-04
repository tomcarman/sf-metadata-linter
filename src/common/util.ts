import * as path from 'node:path';
import { readdir } from 'node:fs/promises';
import { Messages } from '@salesforce/core';
import { XMLParser } from 'fast-xml-parser';
import { encode } from 'html-entities';
import indexToPosition from 'index-to-position';
import {
  FlowApexPluginCall,
  FlowRecordCreate,
  FlowCollectionProcessor,
  FlowActionCall,
} from '@salesforce/types/metadata';
import { warningsCache } from '../commands/metalint/run.js';
import type { Location } from './types.js';
import type { AnyFlowNode } from './experimental/FlowNodeTypes.js';

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

// Many of the @salesforce/types/metadata types (correctly) assign metadata values to arrays,
// but when parsing xml, if there is only one element, the parser does not know it should be an array.
export function arrayify<T>(input: T[] | T): T[] {
  return Array.isArray(input) ? input : [input];
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

export function getFlowComponentTypeLabel(typeOfNode: string, node: AnyFlowNode): string {
  if (flowComponentLabels.has(typeOfNode)) {
    return flowComponentLabels.get(typeOfNode)!;
  }
  switch (typeOfNode) {
    case 'recordCreates':
      return getRecordCreatesLabel(node as FlowRecordCreate);
    case 'collectionProcessors':
      return getCollectionProcessorsLabel(node as FlowCollectionProcessor);
    case 'actionCalls':
      return getActionCallsLabel(node as FlowActionCall);
    case 'apexPluginCalls':
      return getApexPluginCallsLabel(node as FlowApexPluginCall);
    default:
      return typeOfNode;
  }
}

const flowComponentLabels = new Map<string, string>([
  ['start', 'Start'],
  ['assignments', 'Assignment'],
  ['screens', 'Screen'],
  ['subflows', 'Subflow'],
  ['recordDeletes', 'Delete Records'],
  ['recordLookups', 'Get Records'],
  ['recordUpdates', 'Update Records'],
  ['customErrors', 'Custom Error'],
  ['recordRollbacks', 'Roll Back Records'],
  ['transforms', 'Transform'],
  ['decisions', 'Decision'],
  ['loops', 'Loop'],
  ['steps', 'Step'],
  ['orchestratedStages', 'Orchestrated Stage'],
  ['waits', 'Wait'],
]);

function getRecordCreatesLabel(node: FlowRecordCreate): string {
  return node.object?.includes('__e') ? 'Platform Event' : 'Create Records';
}

function getCollectionProcessorsLabel(node: FlowCollectionProcessor): string {
  const typeLabels = {
    SortCollectionProcessor: 'Collection Sort',
    FilterCollectionProcessor: 'Collection Filter',
    RecommendationMapCollectionProcessor: 'Collection Recommendation Map',
  };
  return typeLabels[node.collectionProcessorType] || 'Collection';
}

function getActionCallsLabel(node: FlowActionCall): string {
  const actionTypeLabels: { [key: string]: string } = {
    apex: `Apex: ${node.actionName}`,
    emailSimple: `Send Email: ${node.actionName}`,
    emailSObject: `Send Email: ${node.actionName}`,
    emailAlert: `Email Alert: ${node.actionName}`,
    externalService: `External Service: ${node.actionName}`,
    chatterPost: `Chatter Post: ${node.actionName}`,
  };
  let label;
  if (node.actionType !== undefined) {
    label = actionTypeLabels[node.actionType];
  }
  return (label ?? `Action: ${node.actionName}`) || 'Action';
}

function getApexPluginCallsLabel(node: FlowApexPluginCall): string {
  return `Apex Plugin Call: ${node.apexClass}`;
}
