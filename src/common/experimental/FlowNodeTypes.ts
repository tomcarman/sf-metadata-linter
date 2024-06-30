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
  FlowChoice,
  FlowConstant,
  FlowDynamicChoiceSet,
  FlowFormula,
  FlowStage,
  FlowTextTemplate,
  FlowVariable,
} from '@salesforce/types/metadata';

export type AnyFlowNode =
  | FlowAssignment
  | FlowCollectionProcessor
  | FlowCustomError
  | FlowRecordRollback
  | FlowScreen
  | FlowSubflow
  | FlowTransform
  | FlowActionCall
  | FlowApexPluginCall
  | FlowOrchestratedStage
  | FlowRecordCreate
  | FlowRecordDelete
  | FlowRecordLookup
  | FlowRecordUpdate
  | FlowWait
  | FlowDecision
  | FlowLoop
  | FlowStep
  | FlowStart;

export type AnyFlowElement = [
  FlowChoice | FlowConstant | FlowDynamicChoiceSet | FlowFormula | FlowStage | FlowTextTemplate | FlowVariable
];
