import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectCiRuntimeContractErrors } from '../../scripts/ciRuntimeContract.js';

const currentPackage = readFileSync(resolve('package.json'), 'utf8');
const currentWorkflow = readFileSync(resolve('.github/workflows/ci.yml'), 'utf8').replace(/\r\n?/gu, '\n');

describe('CI Node runtime contract', () => {
  it('accepts the current package declarations and workflow matrix', () => {
    expect(collectCiRuntimeContractErrors(currentPackage, currentWorkflow)).toEqual([]);
    expect(collectCiRuntimeContractErrors(currentPackage, currentWorkflow.replaceAll('\n', '\r\n'))).toEqual([]);
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

  it('rejects Windows native-toolchain and action-runtime regressions', () => {
    expect(
      collectCiRuntimeContractErrors(
        currentPackage,
        currentWorkflow.replaceAll('windows-2022', 'windows-latest'),
      ),
    ).toContain(
      '.github/workflows/ci.yml: matrix.os must retain the supported Windows 2022 toolchain',
    );
    expect(
      collectCiRuntimeContractErrors(
        currentPackage,
        currentWorkflow.replace('pnpm/action-setup@v6', 'pnpm/action-setup@v4'),
      ),
    ).toContain(
      '.github/workflows/ci.yml: pnpm/action-setup must use the Node 24-compatible v6 action',
    );
  });

  it('rejects cross-platform test-lane drift', () => {
    expect(
      collectCiRuntimeContractErrors(
        currentPackage,
        currentWorkflow.replace("if: matrix.os != 'windows-2022'", "if: matrix.os == 'ubuntu-latest'"),
      ),
    ).toContain('.github/workflows/ci.yml: full test suite must run on the supported Unix hosts');
    expect(
      collectCiRuntimeContractErrors(
        currentPackage,
        currentWorkflow.replace(
          'pnpm exec vitest run tests/scripts/ciRuntimeContract.test.ts',
          'pnpm run test',
        ),
      ),
    ).toContain('.github/workflows/ci.yml: Windows must run the focused runtime-contract tests');
  });

  it('rejects removal of the reproducible manual CI entrypoint', () => {
    expect(
      collectCiRuntimeContractErrors(
        currentPackage,
        currentWorkflow.replace('  workflow_dispatch:\n', ''),
      ),
    ).toContain('.github/workflows/ci.yml: workflow_dispatch must remain available');
  });
});
