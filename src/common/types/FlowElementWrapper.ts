import type { AnyFlowElement } from './FlowNodeTypes.js';

export class FlowElementWrapper {
  public type: string;
  public element: AnyFlowElement;

  public constructor(typeOfElement: string, element: AnyFlowElement) {
    this.type = typeOfElement;
    this.element = element;
  }
}
