import * as fs from 'node:fs';
import type { Flow } from '@salesforce/types/metadata';
import { RuleClass, SingleRuleResult } from '../common/types.js';
import { parseMetadataXml } from '../common/util.js';
import { FlowWrapper } from '../common/types/FlowWrapper.js';
import { RuleOption } from '../common/config-parser.js';

export default class MaxFlowComplexity extends RuleClass {
  public ruleId: string = 'max-flow-complexity';
  public startLine = 1;
  public endLine = 1;

  public maximumComplexity = 10; // Default Value

  public constructor(files: string[], level: string, options: RuleOption[]) {
    super(files, level);
    if (options) {
      const maximumComplexity = options.find((ruleOption) => ruleOption.name === 'maximumComplexity');
      if (maximumComplexity) {
        this.maximumComplexity = maximumComplexity.value as number;
      }
    }
  }

  public get shortDescriptionText(): string {
    return `Flow has a cyclomatic complexity higher than ${this.maximumComplexity}.`;
  }
  public get fullDescriptionText(): string {
    return `Flow has a cyclomatic complexity higher than ${this.maximumComplexity}.`;
  }

  /*
  Cyclomatic complexity is calculated by:  M = E - N + 2P 
  Where:  E = number of edges
          N = number of nodes
          P = number of connected components (typically 1 for a Flow)
  https://en.wikipedia.org/wiki/Cyclomatic_complexity
  */
  public execute(): void {
    const flows = this.files.filter((file) => file.endsWith('.flow-meta.xml'));

    for (const file of flows) {
      const fileText = fs.readFileSync(file, 'utf-8');
      const flow = parseMetadataXml<Flow>(fileText, 'Flow');
      const flowWrapper = new FlowWrapper(flow);

      const totalNodes = flowWrapper.nodes.length;
      const totalConnectors = flowWrapper.nodes.reduce((cons, node) => cons + node.connectors.length, 0);
      const complexity = totalConnectors - totalNodes + 2;

      console.log('Flow Name: ', flowWrapper.flowName, ' Complexity: ', complexity);

      /* 1 - 10: Simple procedure, little risk
        11 - 20: More complex, moderate risk
        21 - 50: Complex, high risk
        > 50: Untestable code, very high risk 
      */

      if (complexity > this.maximumComplexity) {
        this.results.push(new SingleRuleResult(file, this.startLine, this.endLine, 0, 0));
      }
    }
  }
}
