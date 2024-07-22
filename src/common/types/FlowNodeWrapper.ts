import type { FlowConnector } from '@salesforce/types/metadata';
import { arrayify, getFlowComponentTypeLabel } from '../util.js';
import type { AnyFlowNode } from './FlowNodeTypes.js';

type Connector = FlowConnector & {
  type: string;
  connectionLabel?: string;
};

export class FlowNodeWrapper {
  public type: string;
  public typeLabel: string;
  public name: string;
  public label: string;
  public location?: [number, number];
  public data: AnyFlowNode;
  public connectors: Connector[] = [];

  public constructor(typeOfNode: string, node: AnyFlowNode) {
    this.type = typeOfNode;
    this.typeLabel = getFlowComponentTypeLabel(typeOfNode, node);
    this.name = typeOfNode === 'start' ? 'Start' : node.name ?? 'Unknown Node Name';
    this.label = node.label ?? this.name;
    this.location = [node.locationX, node.locationY];
    this.data = node;
    this.buildConnections(node);
    this.buildTerminators();
  }

  private buildConnections(node: AnyFlowNode): void {
    this.addStandardConnector(node);
    this.addFaultConnector(node);
    this.addDefaultConnector(node);
    this.addNextValueConnector(node);
    this.addNoMoreValuesConnector(node);
    this.addWaitEventConnectors(node);
    this.addRuleConnectors(node);
    this.addScheduledPaths(node);
    this.addTerminatorWhenMissingDefaultConnector(node);
  }

  private buildTerminators(): void {
    if (this.connectors.length === 0) {
      this.addTerminator();
    }
  }

  private addConnector(connectorType: string, connector: FlowConnector, connectionLabel?: string): void {
    this.connectors.push({ type: connectorType, ...connector, connectionLabel });
  }

  private addTerminator(connectionLabel?: string): void {
    const connectorType = 'Terminator';
    const connector: FlowConnector = { targetReference: '', processMetadataValues: [{ name: '' }] };
    this.connectors.push({ type: connectorType, ...connector, connectionLabel });
  }

  private addTerminatorWhenMissingDefaultConnector(node: AnyFlowNode): void {
    if (this.type === 'decisions') {
      if ('defaultConnectorLabel' in node && !('defaultConnector' in node)) {
        this.addTerminator(node.defaultConnectorLabel);
      }
    }
  }

  private addStandardConnector(node: AnyFlowNode): void {
    if ('connector' in node && node.connector) {
      const connectionLabel = this.type === 'start' ? 'Run Immediately' : undefined;
      this.addConnector('connector', node.connector, connectionLabel);
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
      this.addConnector('defaultConnector', node.defaultConnector, node.defaultConnectorLabel);
    }
  }

  private addNextValueConnector(node: AnyFlowNode): void {
    if ('nextValueConnector' in node && node.nextValueConnector) {
      this.addConnector('nextValueConnector', node.nextValueConnector, 'For Each');
      if (!('noMoreValuesConnector' in node)) {
        // Does not have a noMoreValuesConnector
        this.addTerminator('After Last');
      }
    }
  }

  private addNoMoreValuesConnector(node: AnyFlowNode): void {
    if ('noMoreValuesConnector' in node && node.noMoreValuesConnector) {
      this.addConnector('noMoreValuesConnector', node.noMoreValuesConnector, 'After Last');
    }
  }

  private addWaitEventConnectors(node: AnyFlowNode): void {
    if ('waitEvents' in node && node.waitEvents) {
      arrayify(node.waitEvents).forEach((waitEvent) => {
        const connectionLabel = waitEvent.name ? waitEvent.label : undefined;
        if (waitEvent.connector) {
          this.addConnector('connector', waitEvent.connector, connectionLabel);
        } else {
          this.addTerminator(connectionLabel);
        }
      });
    }
  }

  private addRuleConnectors(node: AnyFlowNode): void {
    // Narrow type with 'fields', as both FlowRule and FlowScreenRule can be assigned to node.rules
    if ('rules' in node && node.rules && !('fields' in node)) {
      arrayify(node.rules).forEach((rule) => {
        if ('connector' in rule && rule.connector) {
          this.addConnector('connector', rule.connector, rule.label);
        } else {
          this.addTerminator(rule.label);
        }
      });
    }
  }

  private addScheduledPaths(node: AnyFlowNode): void {
    if ('scheduledPaths' in node && node.scheduledPaths) {
      arrayify(node.scheduledPaths).forEach((path) => {
        if (path.connector) {
          const connectionLabel =
            path.label ?? (path.pathType === 'AsyncAfterCommit' ? 'Run Asynchronously' : undefined);
          this.addConnector('connector', path.connector, connectionLabel);
        }
      });
    }
  }
}
