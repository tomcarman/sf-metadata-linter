import { FlowWrapper } from './FlowWrapper.js';
import { FlowNodeWrapper } from './FlowNodeWrapper.js';

export function walk(flow: FlowWrapper): void {
  const startNode = flow.nodes.find((node: FlowNodeWrapper) => node.type === 'start');

  if (startNode) {
    const visitedNodes = new Set<string>();
    const stack: FlowNodeWrapper[] = [startNode];

    while (stack.length > 0) {
      const currentNode = stack.pop();
      console.debug('currentNode: ', currentNode?.name);

      if (currentNode && !visitedNodes.has(currentNode.name)) {
        visitedNodes.add(currentNode.name);
        const connectors = currentNode.connectors;

        connectors.forEach((connector) => {
          const targetNode = flow.nodes.find((node) => node.name === connector.targetReference);
          if (targetNode) {
            stack.push(targetNode);
          }
        });
      }
    }
  }
}
