const ACTIVE_PLAN_INDEX_HEADING = 'Current canonical active execution plan:';
const CANONICAL_PLAN_ENTRY = /^- `(?<path>docs\/dev\/plans\/[^`\s]+\.md)`$/u;
const SECTION_HEADING = /^(?:#{1,6}\s|[A-Z][^:]*:\s*$)/u;

function collectActivePlanIndexLines(planIndexText: string): string[] | null {
  const lines = planIndexText.split(/\r?\n/u);
  const headingIndex = lines.findIndex(
    (line) => line.trim() === ACTIVE_PLAN_INDEX_HEADING,
  );
  if (headingIndex < 0) return null;

  const sectionLines: string[] = [];
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = (lines[index] ?? '').trim();
    if (!line) continue;
    if (SECTION_HEADING.test(line)) break;
    sectionLines.push(line);
  }
  return sectionLines;
}

export function collectActivePlanIndexPaths(planIndexText: string): string[] {
  return (collectActivePlanIndexLines(planIndexText) ?? []).flatMap((line) => {
    const path = line.match(CANONICAL_PLAN_ENTRY)?.groups?.path;
    return path ? [path] : [];
  });
}

export function collectActivePlanIndexStateErrors(
  planIndexText: string,
  planStates: ReadonlyMap<string, string | null>,
): string[] {
  const sectionLines = collectActivePlanIndexLines(planIndexText);
  if (!sectionLines) {
    return [
      'docs/dev/plan-index.md: missing "Current canonical active execution plan:" section',
    ];
  }

  const errors: string[] = [];
  const seen = new Set<string>();
  for (const line of sectionLines) {
    const planPath = line.match(CANONICAL_PLAN_ENTRY)?.groups?.path;
    if (!planPath) {
      if (line.startsWith('- ')) {
        errors.push(
          `docs/dev/plan-index.md: malformed active-plan entry ${JSON.stringify(line)}`,
        );
      }
      continue;
    }
    if (seen.has(planPath)) {
      errors.push(`docs/dev/plan-index.md: duplicate active plan ${planPath}`);
      continue;
    }
    seen.add(planPath);

    if (!planStates.has(planPath)) {
      errors.push(`docs/dev/plan-index.md: active entry references missing plan ${planPath}`);
      continue;
    }
    const state = planStates.get(planPath);
    if (!state) {
      errors.push(
        `docs/dev/plan-index.md: active entry references plan without canonical State: ${planPath}`,
      );
      continue;
    }
    if (state === 'CLOSED' || state === 'CANCELLED') {
      errors.push(
        `docs/dev/plan-index.md: active entry references terminal plan ${planPath} (State: ${state})`,
      );
      continue;
    }
    if (state !== 'OPEN' && state !== 'PLANNED') {
      errors.push(
        `docs/dev/plan-index.md: active entry references non-active plan ${planPath} (State: ${state}; expected OPEN/PLANNED)`,
      );
    }
  }
  return errors;
}
