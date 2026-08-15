#!/usr/bin/env tsx
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parsePackage(packageText: string, errors: string[]): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(packageText);
    if (!isRecord(parsed)) {
      errors.push('package.json: expected a JSON object');
      return null;
    }
    return parsed;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    errors.push(`package.json: invalid JSON (${detail})`);
    return null;
  }
}

function readCanonicalMinimumMajor(
  value: unknown,
  label: string,
  errors: string[],
): number | null {
  if (typeof value !== 'string') {
    errors.push(`${label} must be a string`);
    return null;
  }
  const match = /^>=(\d+)$/u.exec(value);
  if (!match?.[1]) {
    errors.push(`${label} must use the canonical >=<major> form`);
    return null;
  }
  return Number(match[1]);
}

function readPackageMinimumMajor(
  packageJson: Record<string, unknown>,
  errors: string[],
): number | null {
  const engines = packageJson.engines;
  const enginesMajor = readCanonicalMinimumMajor(
    isRecord(engines) ? engines.node : undefined,
    'package.json: engines.node',
    errors,
  );

  const devEngines = packageJson.devEngines;
  const runtime = isRecord(devEngines) ? devEngines.runtime : undefined;
  const nodeEntries = Array.isArray(runtime)
    ? runtime.filter((entry) => isRecord(entry) && entry.name === 'node')
    : [];
  if (nodeEntries.length !== 1) {
    errors.push('package.json: devEngines.runtime must contain exactly one Node entry');
    return enginesMajor;
  }
  const devEnginesMajor = readCanonicalMinimumMajor(
    nodeEntries[0]?.version,
    'package.json: devEngines.runtime Node version',
    errors,
  );
  if (
    enginesMajor !== null
    && devEnginesMajor !== null
    && enginesMajor !== devEnginesMajor
  ) {
    errors.push(
      `package.json: engines.node minimum ${String(enginesMajor)} must match devEngines.runtime Node minimum ${String(devEnginesMajor)}`,
    );
  }
  return enginesMajor;
}

function readPtyDependencyContract(
  packageJson: Record<string, unknown>,
  errors: string[],
): void {
  const devDependencies = isRecord(packageJson.devDependencies)
    ? packageJson.devDependencies
    : {};
  const maintainedPackage = '@homebridge/node-pty-prebuilt-multiarch';
  const legacyPackage = '@cdktf/node-pty-prebuilt-multiarch';
  if (devDependencies[maintainedPackage] !== '0.14.1') {
    errors.push(`package.json: devDependencies.${maintainedPackage} must be pinned to 0.14.1`);
  }
  for (const dependencyField of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    const dependencies = packageJson[dependencyField];
    if (isRecord(dependencies) && legacyPackage in dependencies) {
      errors.push(`package.json: ${dependencyField} must not contain ${legacyPackage}`);
    }
  }

  const pnpm = isRecord(packageJson.pnpm) ? packageJson.pnpm : {};
  const onlyBuiltDependencies = Array.isArray(pnpm.onlyBuiltDependencies)
    ? pnpm.onlyBuiltDependencies
    : [];
  if (!onlyBuiltDependencies.includes(maintainedPackage)) {
    errors.push(`package.json: pnpm.onlyBuiltDependencies must contain ${maintainedPackage}`);
  }
  if (onlyBuiltDependencies.includes(legacyPackage)) {
    errors.push(`package.json: pnpm.onlyBuiltDependencies must not contain ${legacyPackage}`);
  }
  const patchedDependencies = pnpm.patchedDependencies;
  if (
    isRecord(patchedDependencies)
    && Object.keys(patchedDependencies).some((key) => key.startsWith(`${legacyPackage}@`))
  ) {
    errors.push(`package.json: pnpm.patchedDependencies must not patch ${legacyPackage}`);
  }

  const scripts = isRecord(packageJson.scripts) ? packageJson.scripts : {};
  if (scripts['test:pty'] !== 'vitest run tests/oracle/streaming.pty.test.ts tests/cli/tui/tty.test.ts') {
    errors.push('package.json: scripts.test:pty must retain the focused PTY contract');
  }
}

function readWorkflowNodeMajors(workflowText: string, errors: string[]): number[] {
  const match = /^\s*node:\s*\[([^\]]+)\]\s*$/mu.exec(workflowText);
  if (!match?.[1]) {
    errors.push('.github/workflows/ci.yml: matrix.node must be an inline major-version list');
    return [];
  }
  const majors = match[1].split(',').map((entry) => {
    const normalized = entry.trim().replace(/^['"]|['"]$/gu, '');
    return /^\d+$/u.test(normalized) ? Number(normalized) : Number.NaN;
  });
  if (majors.some((major) => !Number.isInteger(major) || major < 1)) {
    errors.push('.github/workflows/ci.yml: matrix.node entries must be positive integer majors');
    return [];
  }
  const canonical = [...new Set(majors)].sort((left, right) => left - right);
  if (JSON.stringify(majors) !== JSON.stringify(canonical)) {
    errors.push('.github/workflows/ci.yml: matrix.node must list unique majors in ascending order');
  }
  return majors;
}

export function collectCiRuntimeContractErrors(
  packageText: string,
  workflowText: string,
): string[] {
  const errors: string[] = [];
  const normalizedWorkflowText = workflowText.replace(/\r\n?/gu, '\n');
  const packageJson = parsePackage(packageText, errors);
  const minimumMajor = packageJson ? readPackageMinimumMajor(packageJson, errors) : null;
  if (packageJson) {
    readPtyDependencyContract(packageJson, errors);
  }
  const workflowMajors = readWorkflowNodeMajors(normalizedWorkflowText, errors);

  if (workflowMajors.length < 2) {
    errors.push(
      '.github/workflows/ci.yml: matrix.node must exercise the minimum and a newer supported major',
    );
  }
  if (minimumMajor !== null && !workflowMajors.includes(minimumMajor)) {
    errors.push(
      `.github/workflows/ci.yml: matrix.node must include package minimum ${String(minimumMajor)}`,
    );
  }
  if (minimumMajor !== null) {
    const belowMinimum = workflowMajors.filter((major) => major < minimumMajor);
    if (belowMinimum.length > 0) {
      errors.push(
        `.github/workflows/ci.yml: matrix.node contains below-minimum majors ${belowMinimum.join(', ')}`,
      );
    }
  }
  if (!normalizedWorkflowText.includes(`node-version: \${{ matrix.node }}`)) {
    errors.push('.github/workflows/ci.yml: setup-node must use matrix.node');
  }
  if (!normalizedWorkflowText.includes('os: [ubuntu-latest, macos-latest, windows-latest]')) {
    errors.push('.github/workflows/ci.yml: matrix.os must retain the current Windows runner');
  }
  if (!normalizedWorkflowText.includes('uses: pnpm/action-setup@v6')) {
    errors.push('.github/workflows/ci.yml: pnpm/action-setup must use the Node 24-compatible v6 action');
  }
  if (
    !normalizedWorkflowText.includes(
      'name: Run maintained PTY contract on every supported OS\n        run: pnpm run test:pty',
    )
  ) {
    errors.push('.github/workflows/ci.yml: maintained PTY contract must run on every supported OS');
  }
  if (
    !normalizedWorkflowText.includes(
      'name: Run full test suite on every supported OS\n        run: pnpm run test',
    )
  ) {
    errors.push('.github/workflows/ci.yml: full test suite must run on every supported OS');
  }
  if (
    !normalizedWorkflowText.includes(
      'name: Run real readiness smoke on every supported OS\n        run: pnpm run smoke:dashboard-session-readiness',
    )
  ) {
    errors.push('.github/workflows/ci.yml: real readiness smoke must run on every supported OS');
  }
  if (!/^\s*workflow_dispatch:\s*$/mu.test(normalizedWorkflowText)) {
    errors.push('.github/workflows/ci.yml: workflow_dispatch must remain available');
  }
  return errors;
}

export function checkRepositoryCiRuntimeContract(): string[] {
  return collectCiRuntimeContractErrors(
    readFileSync(resolve('package.json'), 'utf8'),
    readFileSync(resolve('.github/workflows/ci.yml'), 'utf8'),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const errors = checkRepositoryCiRuntimeContract();
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('CI Node runtime contract: PASS');
  }
}
