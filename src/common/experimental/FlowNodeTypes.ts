import {
  Flow,
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

export const FlowNodeTypes: Array<keyof Flow> = [
  'assignments',
  'collectionProcessors',
  'customErrors',
  'recordRollbacks',
  'screens',
  'subflows',
  'transforms',
  'actionCalls',
  'apexPluginCalls',
  'orchestratedStages',
  'recordCreates',
  'recordDeletes',
  'recordLookups',
  'recordUpdates',
  'waits',
  'decisions',
  'loops',
  'steps',
  'start',
];

export const FlowElementTypes: Array<keyof Flow> = [
  'choices',
  'constants',
  'dynamicChoiceSets',
  'formulas',
  'stages',
  'textTemplates',
  'variables',
];
