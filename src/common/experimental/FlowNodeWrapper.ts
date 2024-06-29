import { FlowConnector } from '@salesforce/types/metadata';
import {
  NodeType,
  NodeWithConnector,
  NodeWithFaultConnector,
  NodeWithDefaultConnector,
  NodeWithNextValueConnector,
  NodeWithNoMoreValuesConnector,
  NodeWithWaitEvents,
  NodeWithRules,
  NodeWithScheduledPaths,
} from './FlowNodeTypes.js';

type Connector = FlowConnector & {
  type: string;
};

export class FlowNodeWrapper {
  public name: string;
  public connectors: Connector[] = [];

  public constructor(nodeType: NodeType) {
    this.name = nodeType.name ?? '';
    this.handleConnectors(nodeType);
  }

  private handleConnectors(nodeType: NodeType): void {
    this.addStandardConnectors(nodeType);
    this.addFaultConnector(nodeType);
    this.addDefaultConnector(nodeType);
    this.addNextValueConnector(nodeType);
    this.addNoMoreValuesConnector(nodeType);
    this.addWaitEventConnectors(nodeType);
    this.addRuleConnectors(nodeType);
    this.addScheduledPaths(nodeType);
  }

  private addConnector(connectorType: string, connector: FlowConnector): void {
    this.connectors.push({ type: connectorType, ...connector });
  }

  private addStandardConnectors(nodeType: NodeType): void {
    if (hasConnector(nodeType) && nodeType.connector) {
      const connectors: FlowConnector[] = Array.isArray(nodeType.connector) ? nodeType.connector : [nodeType.connector];
      connectors.forEach((connector) => this.addConnector('connector', connector));
    }
  }

  private addFaultConnector(nodeType: NodeType): void {
    if (hasFaultConnector(nodeType) && nodeType.faultConnector) {
      this.addConnector('faultConnector', nodeType.faultConnector);
    }
  }

  private addDefaultConnector(nodeType: NodeType): void {
    if (hasDefaultConnector(nodeType) && nodeType.defaultConnector) {
      this.addConnector('defaultConnector', nodeType.defaultConnector);
    }
  }

  private addNextValueConnector(nodeType: NodeType): void {
    if (hasNextValueConnector(nodeType) && nodeType.nextValueConnector) {
      this.addConnector('nextValueConnector', nodeType.nextValueConnector);
    }
  }

  private addNoMoreValuesConnector(nodeType: NodeType): void {
    if (hasNoMoreValuesConnector(nodeType) && nodeType.noMoreValuesConnector) {
      this.addConnector('noMoreValuesConnector', nodeType.noMoreValuesConnector);
    }
  }
  private addWaitEventConnectors(nodeType: NodeType): void {
    if (hasWaitEvents(nodeType)) {
      nodeType.waitEvents.forEach((waitEvent) => {
        if (waitEvent.connector) {
          this.addConnector('connector', waitEvent.connector);
        }
      });
    }
  }

  private addRuleConnectors(nodeType: NodeType): void {
    if (hasRules(nodeType)) {
      nodeType.rules.forEach((rule) => {
        if (rule.connector) {
          this.addConnector('connector', rule.connector);
        }
      });
    }
  }

  private addScheduledPaths(nodeType: NodeType): void {
    if (hasScheduledPaths(nodeType)) {
      nodeType.scheduledPaths.forEach((path) => {
        if (path.connector) {
          this.addConnector('connector', path.connector);
        }
      });
    }
  }
}

const hasConnector = (node: NodeType): node is NodeWithConnector => 'connector' in node;
const hasFaultConnector = (node: NodeWithConnector): node is NodeWithFaultConnector => 'faultConnector' in node;
const hasDefaultConnector = (node: NodeType): node is NodeWithDefaultConnector => 'defaultConnector' in node;
const hasNextValueConnector = (node: NodeType): node is NodeWithNextValueConnector => 'nextValueConnector' in node;
const hasNoMoreValuesConnector = (node: NodeType): node is NodeWithNoMoreValuesConnector =>
  'noMoreValuesConnector' in node;
const hasWaitEvents = (node: NodeType): node is NodeWithWaitEvents => 'waitEvents' in node;
const hasRules = (node: NodeType): node is NodeWithRules => 'rules' in node;
const hasScheduledPaths = (node: NodeType): node is NodeWithScheduledPaths => 'scheduledPaths' in node;
