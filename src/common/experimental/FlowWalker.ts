import { FlowWrapper } from './FlowWrapper.js';
import { FlowNodeWrapper } from './FlowNodeWrapper.js';

export function walk(flow: FlowWrapper): void {
  console.log('\n\n\n--- FLOW ---');
  console.log('\n\nFlow Name: ', flow.flowName);

  const startNode = flow.nodes.find((node: FlowNodeWrapper) => node.type === 'start');

  if (startNode) {
    const visitedNodes = new Set<string>();
    const stack: FlowNodeWrapper[] = [startNode];

    while (stack.length > 0) {
      const currentNode = stack.pop();
      if (currentNode) printNode(currentNode);

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

export type PathEntry = {
  nodeName: string;
  nodeType: string;
  nodeLocation?: [number, number];
  connectorLabel?: string;
};

export function getPaths(flow: FlowWrapper): PathEntry[][] {
  const nodesMap: { [key: string]: FlowNodeWrapper } = {};
  flow.nodes.forEach((node) => {
    nodesMap[node.name] = node;
    // console.log(node.name);
    // console.log(node.connectors);
  });
  const paths: PathEntry[][] = [];
  const visited: { [key: string]: number } = {};

  function explore(currentNode: string, path: PathEntry[], visitedLoops: Set<string>, connectorLabel?: string): void {
    if (visited[currentNode]) {
      visited[currentNode]++;
    } else {
      visited[currentNode] = 1;
    }

    const node = nodesMap[currentNode];
    const currentPathEntry: PathEntry = {
      nodeName: node.name,
      nodeType: node.type,
      nodeLocation: node.location,
      connectorLabel,
    };
    path.push(currentPathEntry);

    if (!node || node.connectors.length === 0) {
      paths.push([...path]);
      path.pop();
      return;
    }
    let isTerminator = false;
    for (const connector of node.connectors) {
      if (connector.type === 'Terminator') {
        paths.push([...path, { nodeName: 'END', nodeType: 'Terminator', connectorLabel: connector.connectionLabel }]);
        isTerminator = true;
      } else if (connector.type === 'nextValueConnector') {
        if (!visitedLoops.has(currentNode)) {
          visitedLoops.add(currentNode);
          explore(connector.targetReference, [...path], visitedLoops, connector.connectionLabel);
          visitedLoops.delete(currentNode);
        }
      } else if (!visited[connector.targetReference] || visited[connector.targetReference] < 2) {
        explore(connector.targetReference, [...path], visitedLoops, connector.connectionLabel);
      }
    }

    if (isTerminator && node.connectors.length === 0) {
      paths.push([...path]);
    }

    path.pop();

    if (visited[currentNode] > 1) {
      visited[currentNode]--;
    } else {
      delete visited[currentNode];
    }
  } // End explore

  explore('Start', [], new Set<string>());

  // printPaths(paths);

  return paths;
}

function printNode(node: FlowNodeWrapper): void {
  console.log('\n\n--- NODE ---');
  console.log('Name: ', node.name);
  console.log(' Type: ', node.type);
  console.log(' Location: ', node.location);
  node.connectors.forEach((connector) => {
    console.log(' Connections:');
    console.log('   Connection Type: ', connector.type);
    console.log('   Connects to: ', connector.targetReference);
    console.log('   Connection Label: ', connector.connectionLabel);
  });
}
