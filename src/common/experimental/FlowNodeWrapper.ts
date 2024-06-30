import type { FlowConnector } from '@salesforce/types/metadata';
import { arrayify } from '../util.js';
import type { AnyFlowNode } from './FlowNodeTypes.js';

type Connector = FlowConnector & {
  type: string;
};

export class FlowNodeWrapper {
  public type: string;
  public name: string;
  public node: AnyFlowNode;
  public connectors: Connector[] = [];

  public constructor(typeOfNode: string, node: AnyFlowNode) {
    this.type = typeOfNode;
    this.name = node.name ?? '';
    this.node = node;
    this.handleConnectors(node);
  }

  private handleConnectors(node: AnyFlowNode): void {
    this.addStandardConnector(node);
    this.addFaultConnector(node);
    this.addDefaultConnector(node);
    this.addNextValueConnector(node);
    this.addNoMoreValuesConnector(node);
    this.addWaitEventConnectors(node);
    this.addRuleConnectors(node);
    this.addScheduledPaths(node);
  }

  private addConnector(connectorType: string, connector: FlowConnector): void {
    this.connectors.push({ type: connectorType, ...connector });
  }

  private addStandardConnector(node: AnyFlowNode): void {
    if ('connector' in node && node.connector) {
      this.addConnector('connector', node.connector);
    }
    if ('connectors' in node && node.connectors) {
      arrayify(node.connectors).forEach((connector) => this.addConnector('connector', connector));
    }
  }

  private addFaultConnector(node: AnyFlowNode): void {
    if ('faultConnector' in node && node.faultConnector) {
      this.addConnector('faultConnector', node.faultConnector);
    }
  }

  private addDefaultConnector(node: AnyFlowNode): void {
    if ('defaultConnector' in node && node.defaultConnector) {
      this.addConnector('defaultConnector', node.defaultConnector);
    }
  }

  private addNextValueConnector(node: AnyFlowNode): void {
    if ('nextValueConnector' in node && node.nextValueConnector) {
      this.addConnector('nextValueConnector', node.nextValueConnector);
    }
  }

  private addNoMoreValuesConnector(node: AnyFlowNode): void {
    if ('noMoreValuesConnector' in node && node.noMoreValuesConnector) {
      this.addConnector('noMoreValuesConnector', node.noMoreValuesConnector);
    }
  }

  private addWaitEventConnectors(node: AnyFlowNode): void {
    if ('waitEvents' in node && node.waitEvents) {
      arrayify(node.waitEvents).forEach((waitEvent) => {
        if (waitEvent.connector) {
          this.addConnector('connector', waitEvent.connector);
        }
      });
    }
  }

  private addRuleConnectors(node: AnyFlowNode): void {
    // Narrow type with 'fields', as both FlowRule and FlowScreenRule can be assigned to node.rules
    if ('rules' in node && node.rules && !('fields' in node)) {
      arrayify(node.rules).forEach((rule) => {
        if ('connector' in rule && rule.connector) {
          this.addConnector('connector', rule.connector);
        }
      });
    }
  }

  private addScheduledPaths(node: AnyFlowNode): void {
    if ('scheduledPaths' in node && node.scheduledPaths) {
      arrayify(node.scheduledPaths).forEach((path) => {
        if (path.connector) {
          this.addConnector('connector', path.connector);
        }
      });
    }
  }
}
