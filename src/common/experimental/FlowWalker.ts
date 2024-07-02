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

export function getPaths(flow: FlowWrapper): void {
  console.log('\nGetting paths for flow: ', flow.flowName);

  const paths: Array<Array<[string, string?]>> = [];
  const visitedConnections = new Set<string>();

  function explore(node: FlowNodeWrapper, path: Array<[string, string?]>): void {
    console.log('\nExploring node: ', node.name);
    console.log('(previously explored connections: ', visitedConnections, ')');
    console.log('Current path: ', path);

    if (node.connectors.length === 0) {
      console.log('Node has no connectors, adding to paths');
      path.push([node.name]);
      paths.push([...path]);
    } else {
      console.log('Looking for connectors...');

      for (const connector of node.connectors) {
        if (!visitedConnections.has(node.name + connector.targetReference)) {
          console.log('Connector: ', connector);
          console.log('Targets: ', connector.targetReference);
          console.log('Adding to path: ', [node.name, connector.connectionLabel]);
          path.push([node.name, connector.connectionLabel]);

          if (connector.type === 'Terminator') {
            console.log('Terminator found, adding to paths');
            path.push(['END']);
            paths.push([...path]);
          } else {
            if (connector.type === 'nextValueConnector') {
              visitedConnections.add(node.name + connector.targetReference);
            }
            // visitedConnections.add(node.name+connector.type+connector.targetReference);
            const targetNode = flow.nodes.find((x) => x.name === connector.targetReference);
            if (targetNode) {
              console.log('Found target node: ', targetNode.name);
              explore(targetNode, path);
            } else {
              paths.push([...path]);
            }
          }
        }
      }
    }

    console.log('Backtracking...');
    path.pop();
  }

  explore(flow.nodes.find((x) => x.type === 'start') as FlowNodeWrapper, []);

  return printPaths(paths);
}

function printPaths(paths: Array<Array<[string, string?]>>): void {
  if (paths) {
    console.log(paths);
  }
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
