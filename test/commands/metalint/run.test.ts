import { TestContext } from '@salesforce/core/testSetup';
// import { expect } from 'chai';
// import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
// import MetalintRun from '../../../src/commands/metalint/run.js';

describe('metalint run', () => {
  const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  beforeEach(() => {
    // sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  // it('runs hello', async () => {
  //   await MetalintRun.run([]);
  //   const output = sfCommandStubs.log
  //     .getCalls()
  //     .flatMap((c) => c.args)
  //     .join('\n');
  //   expect(output).to.include('hello world');
  // });

  // it('runs hello with --json and no provided name', async () => {
  //   const result = await MetalintRun.run([]);
  //   expect(result.path).to.equal('/Users/tom.carman/dev/git/sf-metadata-linter/src/commands/metalint/run.ts');
  // });

  // it('runs hello world --name Astro', async () => {
  //   await MetalintRun.run(['--name', 'Astro']);
  //   const output = sfCommandStubs.log
  //     .getCalls()
  //     .flatMap((c) => c.args)
  //     .join('\n');
  //   expect(output).to.include('hello Astro');
  // });
});
