import { Flow } from '@salesforce/types/metadata';
import { NodeType, FlowNodeWrapper } from './FlowNodeWrapper.js';

export class FlowWrapper {
  public flowName: string;
  public nodes: FlowNodeWrapper[] = [];

  public constructor(flow: Flow) {
    this.flowName = flow.fullName ?? '';

    const properties: Array<keyof Flow> = [
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
    properties.forEach((property) => {
      if (flow[property] !== undefined) {
        if (Array.isArray(flow[property])) {
          (flow[property] as NodeType[]).forEach((node) => {
            this.nodes.push(new FlowNodeWrapper(node));
          });
        } else {
          this.nodes.push(new FlowNodeWrapper(flow[property] as NodeType));
        }
      }
    });
  }
}
