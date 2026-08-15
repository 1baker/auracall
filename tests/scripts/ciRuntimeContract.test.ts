import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectCiRuntimeContractErrors } from '../../scripts/ciRuntimeContract.js';

const currentPackage = readFileSync(resolve('package.json'), 'utf8');
const currentWorkflow = readFileSync(resolve('.github/workflows/ci.yml'), 'utf8');

describe('CI Node runtime contract', () => {
  it('accepts the current package declarations and workflow matrix', () => {
    expect(collectCiRuntimeContractErrors(currentPackage, currentWorkflow)).toEqual([]);
  });

  it('rejects mismatched package minimum declarations', () => {
    const packageJson = JSON.parse(currentPackage) as Record<string, unknown>;
    packageJson.devEngines = {
      runtime: [{ name: 'node', version: '>=24' }],
    };

    expect(
      collectCiRuntimeContractErrors(JSON.stringify(packageJson), currentWorkflow),
    ).toContain(
      'package.json: engines.node minimum 22 must match devEngines.runtime Node minimum 24',
    );
  });

  it('rejects below-minimum, missing-minimum, and single-version matrices', () => {
    expect(
      collectCiRuntimeContractErrors(
        currentPackage,
        currentWorkflow.replace('node: [22, 24]', 'node: [20, 24]'),
      ),
    ).toEqual(expect.arrayContaining([
      '.github/workflows/ci.yml: matrix.node must include package minimum 22',
      '.github/workflows/ci.yml: matrix.node contains below-minimum majors 20',
    ]));

    expect(
      collectCiRuntimeContractErrors(
        currentPackage,
        currentWorkflow.replace('node: [22, 24]', 'node: [22]'),
      ),
    ).toContain(
      '.github/workflows/ci.yml: matrix.node must exercise the minimum and a newer supported major',
    );
  });

  it('rejects setup-node bypass of the declared matrix', () => {
    expect(
      collectCiRuntimeContractErrors(
        currentPackage,
        currentWorkflow.replace(`node-version: \${{ matrix.node }}`, "node-version: '20'"),
      ),
    ).toContain('.github/workflows/ci.yml: setup-node must use matrix.node');
  });
});
