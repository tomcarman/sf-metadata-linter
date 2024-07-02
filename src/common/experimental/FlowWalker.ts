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

export function getPaths(flow: FlowWrapper): string[][] {
  const nodesMap: { [key: string]: FlowNodeWrapper } = {};
  flow.nodes.forEach((node) => {
    nodesMap[node.name] = node;
    // console.log(node.name);
    // console.log(node.connectors);
  });
  const paths: string[][] = [];
  const visited: { [key: string]: number } = {};

  function explore(currentNode: string, path: string[], visitedLoops: Set<string>): void {
    if (visited[currentNode]) {
      visited[currentNode]++;
    } else {
      visited[currentNode] = 1;
    }

    const node = nodesMap[currentNode];
    path.push(currentNode);

    if (!node || node.connectors.length === 0) {
      paths.push([...path]);
      path.pop();
      return;
    }
    let isTerminator = false;
    for (const connector of node.connectors) {
      if (connector.type === 'Terminator') {
        paths.push([...path, `${connector.connectionLabel} Terminator`]);
        isTerminator = true;
      } else if (connector.type === 'nextValueConnector') {
        if (!visitedLoops.has(currentNode)) {
          visitedLoops.add(currentNode);
          explore(connector.targetReference, path, visitedLoops);
          visitedLoops.delete(currentNode);
        }
      } else if (!visited[connector.targetReference] || visited[connector.targetReference] < 2) {
        explore(connector.targetReference, path, visitedLoops);
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

// function printPaths(paths: string[][]): void {
//   if (paths) {
//     console.log('All Paths: ', paths);
//   }
// }

// export function getPaths(flow: FlowWrapper): void {
//   console.log('\nGetting paths for flow: ', flow.flowName);

//   const paths: Array<Array<[string, string?]>> = [];
//   const visitedConnections = new Set<string>();

//   function explore(node: FlowNodeWrapper, path: Array<[string, string?]>): void {
//     console.log('\nExploring node: ', node.name);
//     console.log('(previously explored connections: ', visitedConnections, ')');
//     console.log('Current path: ', path);

//     if (node.connectors.length === 0) {
//       console.log('Node has no connectors, adding to paths');
//       path.push([node.name]);
//       paths.push([...path]);
//     } else {
//       console.log('Looking for connectors...');

//       for (const connector of node.connectors) {
//         if (!visitedConnections.has(node.name+connector.type+connector.targetReference)) {
//           console.log('Connector: ', connector);
//           console.log('Targets: ', connector.targetReference);
//           console.log('Adding to path: ', [node.name, connector.connectionLabel]);
//           path.push([node.name, connector.connectionLabel]);

//           // if (connector.type === 'Terminator') {
//           //   console.log('Terminator found, adding to paths');
//           //   path.push(['END']);
//           //   paths.push([...path]);
//           // } else {
//           if (connector.type === 'nextValueConnector') {
//             visitedConnections.add(node.name+connector.type+connector.targetReference);
//           }
//           const targetNode = flow.nodes.find((x) => x.name === connector.targetReference);
//           if (targetNode) {
//             console.log('Found target node: ', targetNode.name);
//             explore(targetNode, path);
//           } else {
//             paths.push([...path]);
//           }
//         }
//       }
//     }
//     console.log('Backtracking...');
//     path.pop();
//   }

//   explore(flow.nodes.find((x) => x.type === 'start') as FlowNodeWrapper, []);

//   return printPaths(paths);

// }

// function printPaths(paths: Array<Array<[string, string?]>>): void {
//   if (paths) {
//     console.log('All Paths: ', paths);
//   }
// }

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
