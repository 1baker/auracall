const CANONICAL_PLAN_LINK = /docs\/dev\/plans\/[^)\s]+\.md/u;

export function collectActiveRoadmapPlanPaths(roadmapText: string): string[] {
  const lines = roadmapText.split(/\r?\n/u);
  const paths: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^- Active\b/iu.test(lines[index] ?? '')) continue;
    const block: string[] = [lines[index] ?? ''];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const line = lines[cursor] ?? '';
      if (/^- /u.test(line) || /^#{1,6}\s/u.test(line)) break;
      block.push(line);
    }
    const path = block.join('\n').match(CANONICAL_PLAN_LINK)?.[0];
    if (path && !paths.includes(path)) paths.push(path);
  }

  return paths;
}

export function collectActiveRoadmapPlanStateErrors(
  roadmapText: string,
  planStates: ReadonlyMap<string, string | null>,
): string[] {
  return collectActiveRoadmapPlanPaths(roadmapText).flatMap((planPath) => {
    const state = planStates.get(planPath);
    return state === 'CLOSED' || state === 'CANCELLED'
      ? [`ROADMAP.md: Active label references terminal plan ${planPath} (State: ${state})`]
      : [];
  });
}
