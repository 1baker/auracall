import type { EngineMode } from './engine.js';
import type { ModelName } from '../oracle.js';
import { isProModel } from '../oracle/modelResolver.js';

export function buildDetachedSessionProcessArgs({
  execArgv,
  entrypoint,
  sessionId,
}: {
  execArgv: readonly string[];
  entrypoint: string;
  sessionId: string;
}): string[] {
  return [...execArgv, '--', entrypoint, '--exec-session', sessionId];
}

export function shouldDetachSession({
  engine,
  model,
  waitPreference,
  disableDetachEnv,
}: {
  engine: EngineMode;
  model: ModelName;
  waitPreference: boolean;
  disableDetachEnv: boolean;
}): boolean {
  if (disableDetachEnv) return false;
  // An explicit --no-wait request is authoritative for local runs. The root
  // command separately keeps remote execution inline because its transport
  // must remain attached.
  if (!waitPreference) return true;
  // Only Pro-tier API runs should start detached by default; browser runs stay inline so failures surface.
  if (isProModel(model) && engine === 'api') return true;
  return false;
}
