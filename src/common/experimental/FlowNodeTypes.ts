import {
  FlowAssignment,
  FlowCollectionProcessor,
  FlowCustomError,
  FlowRecordRollback,
  FlowScreen,
  FlowSubflow,
  FlowTransform,
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

export type NodeWithConnector =
  | FlowAssignment
  | FlowCollectionProcessor
  | FlowCustomError
  | FlowRecordRollback
  | FlowScreen
  | FlowSubflow
  | FlowTransform
  | FlowStart
  | FlowActionCall
  | FlowApexPluginCall
  | FlowOrchestratedStage
  | FlowRecordCreate
  | FlowRecordDelete
  | FlowRecordLookup
  | FlowRecordUpdate;

export type NodeWithFaultConnector =
  | FlowActionCall
  | FlowApexPluginCall
  | FlowOrchestratedStage
  | FlowRecordCreate
  | FlowRecordDelete
  | FlowRecordLookup
  | FlowRecordUpdate;

export type NodeWithDefaultConnector = FlowWait | FlowDecision;
export type NodeWithNextValueConnector = FlowLoop;
export type NodeWithNoMoreValuesConnector = FlowLoop;
export type NodeWithWaitEvents = FlowWait;
export type NodeWithRules = FlowDecision;
export type NodeWithScheduledPaths = FlowStart;
