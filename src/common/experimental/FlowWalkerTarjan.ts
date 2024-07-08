import { FlowWrapper } from './FlowWrapper.js';

class Node {
  public name: string;
  public neighbours: Node[];
  public index: number;
  public lowLink: number;
  public onStack: boolean;
  public visited: boolean;

  public constructor(name: string, neighbours?: Node[]) {
    this.name = name;
    this.neighbours = neighbours ?? [];
    this.index = -1;
    this.lowLink = -1;
    this.onStack = false;
    this.visited = false;
  }
}

export class FlowGraph {
  public log = 'test';
  private stronglyConnectedNodes!: Node[][];
  private nodes: Map<string, Node>;

  public constructor(flow: FlowWrapper) {
    this.nodes = new Map<string, Node>();
    this.initNodes(flow);
  }

  public getNonSingleStronglyConnectedNodes(): Node[][] {
    this.execute();
    return this.stronglyConnectedNodes.filter((scc) => scc.length > 1);
  }

  public getStronglyConnectedNodes(): Node[][] {
    this.execute();
    return this.stronglyConnectedNodes;
  }

  private initNodes(flow: FlowWrapper): void {
    flow.nodes.forEach((flowNode) => {
      const nodeName = flowNode.name;
      const connectors = flowNode.connectors.map((connector) => connector.targetReference);

      // get/create nodes for each connector, and return as neighbours
      connectors.forEach((connector) => this.getNode(connector));
      const neighbours = connectors.map((connector) => this.nodes.get(connector)!);

      // get/create this node, add its neighbours
      const node = this.getNode(nodeName);
      node.neighbours.push(...neighbours);
    });
  }

  private getNode(name: string): Node {
    if (!this.nodes.has(name)) {
      const node = new Node(name);
      this.nodes.set(name, node);
      return node;
    }
    return this.nodes.get(name)!;
  }

  private execute(): void {
    if (!this.stronglyConnectedNodes) {
      this.identifyStronglyConnectedNodes();
    }
  }

  private identifyStronglyConnectedNodes(): this {
    console.log('Processing');
    let index = 0;
    const stack: Node[] = [];
    const stronglyConnectedNodes: Node[][] = [];

    function stronglyConnected(inputNode: Node): void {
      const node = inputNode;
      node.index = index;
      node.lowLink = index;
      index++;
      stack.push(node);
      node.onStack = true;

      node.neighbours.forEach((neighbour) => {
        if (neighbour.index === -1) {
          stronglyConnected(neighbour);
          node.lowLink = Math.min(node.lowLink, neighbour.lowLink);
        } else if (neighbour.onStack) {
          node.lowLink = Math.min(node.lowLink, neighbour.lowLink);
          node.lowLink = Math.min(node.lowLink, neighbour.index);
        }
      });

      if (node.lowLink === node.index) {
        const scc: Node[] = [];
        let neighbour: Node;
        do {
          neighbour = stack.pop() as Node;
          if (!neighbour) {
            break;
          }
          neighbour.onStack = false;
          scc.push(neighbour);
        } while (neighbour !== node);

        stronglyConnectedNodes.push(scc);
      }
    }

    for (const node of this.nodes.values()) {
      if (node.index === -1) {
        stronglyConnected(node);
      }
    }

    this.stronglyConnectedNodes = stronglyConnectedNodes;
    return this;
  }

  // public findAllPaths()
}
