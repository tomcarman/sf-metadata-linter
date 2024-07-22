import { Flow } from '@salesforce/types/metadata';
import { FlowNodeWrapper } from './FlowNodeWrapper.js';
import { FlowElementWrapper } from './FlowElementWrapper.js';
import { AnyFlowNode, AnyFlowElement, FlowNodeTypes, FlowElementTypes } from './FlowNodeTypes.js';

export class FlowWrapper {
  public flowName: string;
  public nodes: FlowNodeWrapper[] = [];
  public elements: FlowElementWrapper[] = [];

  public constructor(flow: Flow) {
    this.flowName = flow.label ?? '';

    FlowNodeTypes.forEach((property) => {
      if (flow[property] !== undefined) {
        if (Array.isArray(flow[property])) {
          (flow[property] as AnyFlowNode[]).forEach((node) => {
            this.nodes.push(new FlowNodeWrapper(property, node));
          });
        } else {
          this.nodes.push(new FlowNodeWrapper(property, flow[property] as AnyFlowNode));
        }
      }
    });

    FlowElementTypes.forEach((property) => {
      if (flow[property] !== undefined) {
        if (Array.isArray(flow[property])) {
          (flow[property] as unknown as AnyFlowElement[]).forEach((node) => {
            this.elements.push(new FlowElementWrapper(property, node));
          });
        } else {
          this.elements.push(new FlowElementWrapper(property, flow[property] as AnyFlowElement));
        }
      }
    });
  }
}
