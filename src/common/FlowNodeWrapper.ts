import {
  FlowAssignment,
  FlowCollectionProcessor,
  FlowCustomError,
  FlowRecordRollback,
  FlowScreen,
  FlowSubflow,
  FlowTransform,
  FlowConnector,
  FlowActionCall,
  FlowApexPluginCall,
  FlowOrchestratedStage,
  FlowRecordCreate,
  FlowRecordDelete,
  FlowRecordLookup,
  FlowRecordUpdate,
  FlowWait,
  FlowDecision,
  FlowLoop,
  FlowStep,
  FlowStart,
} from '@salesforce/types/metadata';

export type NodeType = NodeWithConnector | NodeWithFaultConnector | FlowWait | FlowDecision | FlowLoop | FlowStep;
type NodeWithConnector =
  | FlowAssignment
  | FlowCollectionProcessor
  | FlowCustomError
  | FlowRecordRollback
  | FlowScreen
  | FlowSubflow
  | FlowTransform
  | FlowStart;
type NodeWithFaultConnector =
  | FlowActionCall
  | FlowApexPluginCall
  | FlowOrchestratedStage
  | FlowRecordCreate
  | FlowRecordDelete
  | FlowRecordLookup
  | FlowRecordUpdate;
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
    this.addDecisionConnectors(nodeType);
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
  private addDecisionConnectors(nodeType: NodeType): void {
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
const hasDefaultConnector = (node: NodeType): node is FlowWait | FlowDecision => 'defaultConnector' in node;
const hasNextValueConnector = (node: NodeType): node is FlowLoop => 'nextValueConnector' in node;
const hasNoMoreValuesConnector = (node: NodeType): node is FlowLoop => 'noMoreValuesConnector' in node;
const hasWaitEvents = (node: NodeType): node is FlowWait => 'waitEvents' in node;
const hasRules = (node: NodeType): node is FlowDecision => 'rules' in node;
const hasScheduledPaths = (node: NodeType): node is FlowStart => 'scheduledPaths' in node;
