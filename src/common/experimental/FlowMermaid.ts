import type { FlowNodeWrapper } from './FlowNodeWrapper.js';

export function generateMermaid(nodes: FlowNodeWrapper[]): void {
  console.log('\n\nGenerating Mermaid flow...');
  console.log(generateMermaidFlowWithStyle(nodes));
}

export function generateMermaidFlowWithStyle(nodes: FlowNodeWrapper[]): string {
  let mermaid = '```mermaid\n';
  mermaid += `
    %%{ init: { 'flowchart': { 'curve': 'stepAfter', 'htmlLabels': false } } }%%
    flowchart TD
  `;

  mermaid += `
    classDef orangeNodes fill:#FF5D2D,stroke:#FF5D2D,stroke-width:2px,color:#FFF;
    classDef pinkNodes fill:#FF538A,stroke:#FF538A,stroke-width:2px,color:#FFF;
    classDef blueNodes fill:#032D60,stroke:#032D60,stroke-width:2px,color:#FFF;
    classDef lightBlueNodes fill:#1B96FF,stroke:#1B96FF,stroke-width:2px,color:#FFF;
    classDef start fill:#0B827C,stroke:#0B827C,stroke-width:2px,color:#FFF;
    classDef terminators fill:#EA001E,stroke:#EA001E,stroke-width:2px,color:#FFF,shape:circle;
  `;

  nodes.sort((a, b) => {
    const aLocation = a.location ? a.location[1] : 0;
    const bLocation = b.location ? b.location[1] : 0;
    return aLocation - bLocation;
  });

  const orangeNodeTypes = ['assignments', 'decisions', 'loops', 'transforms', 'collectionProcessors', 'waits'];
  const pinkNodeTypes = ['recordCreates', 'recordDeletes', 'recordLookups', 'recordUpdates', 'recordRollbacks'];
  const blueNodeTypes = ['actionCalls', 'subflows', 'customErrors', 'apexPluginCalls', 'orchestratedStages', 'steps'];
  const lightBlueNodeTypes = ['screens'];

  nodes.forEach((node) => {
    const nodeTypeText = node.type === 'start' ? `\`**${node.label}**\`` : `\`**${node.label}**\n${node.typeLabel}\``;
    node.connectors.forEach((connection) => {
      const source = node.name.replace(/ /g, '_');
      const target = connection.targetReference.replace(/ /g, '_');
      const label = connection.connectionLabel ? `|"${connection.connectionLabel}"|` : '';

      if (connection.type === 'Terminator') {
        mermaid += `    ${source}["${nodeTypeText}"] --> ${label} ${source}_end(("End"))\n`;
      } else {
        mermaid += `    ${source}["${nodeTypeText}"] --> ${label} ${target}["\`**${
          nodes.find((n) => n.name === connection.targetReference)?.label
        }**\n${nodes.find((n) => n.name === connection.targetReference)?.typeLabel}\`"]\n`;
      }
    });
  });

  nodes.forEach((node) => {
    const nodeName = node.name.replace(/ /g, '_');
    const nodeTypeText = node.type === 'start' ? `\`**${node.label}**\`` : `\`**${node.label}**\n${node.typeLabel}\``;
    let nodeClass = '';

    if (orangeNodeTypes.includes(node.type)) {
      nodeClass = 'orangeNodes';
      mermaid += `    ${nodeName}${node.type === 'decisions' ? `{"${nodeTypeText}"}` : `("${nodeTypeText}")`}\n`;
    } else if (pinkNodeTypes.includes(node.type)) {
      nodeClass = 'pinkNodes';
      mermaid += `    ${nodeName}("${nodeTypeText}")\n`;
    } else if (blueNodeTypes.includes(node.type)) {
      nodeClass = 'blueNodes';
      mermaid += `    ${nodeName}("${nodeTypeText}")\n`;
    } else if (lightBlueNodeTypes.includes(node.type)) {
      nodeClass = 'lightBlueNodes';
      mermaid += `    ${nodeName}("${nodeTypeText}")\n`;
    } else if (node.type === 'start') {
      nodeClass = 'start';
      mermaid += `    ${nodeName}("${nodeTypeText}")\n`;
    }

    if (nodeClass) {
      mermaid += `    class ${nodeName} ${nodeClass};\n`;
    }
  });

  nodes.forEach((node) => {
    node.connectors.forEach((connection) => {
      if (connection.type === 'Terminator') {
        const nodeName = node.name.replace(/ /g, '_') + '_end';
        mermaid += `    class ${nodeName} terminators;\n`;
      }
    });
  });

  mermaid += '```';
  return mermaid;
}
