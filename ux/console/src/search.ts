export const SEARCH_PAGE_LIMIT = 80;
export const SEARCH_ROW_HEIGHT = 68;

export type ConsoleSearchState = {
  query: string;
  provider: string;
  tenant: string;
  project: string;
  kind: string;
  status: string;
  assetAvailability: string;
};

export const EMPTY_SEARCH_STATE: ConsoleSearchState = {
  query: "",
  provider: "",
  tenant: "",
  project: "",
  kind: "",
  status: "",
  assetAvailability: "",
};

const ROUTE_KEYS: Record<keyof ConsoleSearchState, string> = {
  query: "q",
  provider: "searchProvider",
  tenant: "tenant",
  project: "project",
  kind: "kind",
  status: "status",
  assetAvailability: "assets",
};

export function readConsoleSearchRoute(search: string): { state: ConsoleSearchState; rowId: string } {
  const params = new URLSearchParams(search);
  const state = { ...EMPTY_SEARCH_STATE };
  for (const [stateKey, routeKey] of Object.entries(ROUTE_KEYS)) {
    state[stateKey as keyof ConsoleSearchState] = cleanRouteValue(params.get(routeKey));
  }
  return {
    state,
    rowId: decodeSearchRowId(params.get("row") ?? ""),
  };
}

export function buildConsoleSearchLocation(
  pathname: string,
  state: ConsoleSearchState,
  rowId = "",
): string {
  const params = new URLSearchParams({ view: "search" });
  for (const [stateKey, routeKey] of Object.entries(ROUTE_KEYS)) {
    const value = state[stateKey as keyof ConsoleSearchState].trim();
    if (value) params.set(routeKey, value);
  }
  if (rowId) params.set("row", encodeSearchRowId(rowId));
  return `${pathname}?${params.toString()}`;
}

export function buildSearchRequestUrl(state: ConsoleSearchState, cursor = ""): string {
  const params = new URLSearchParams({ limit: String(SEARCH_PAGE_LIMIT) });
  append(params, "q", state.query);
  append(params, "provider", state.provider);
  append(params, "tenant", state.tenant);
  append(params, "project", state.project);
  append(params, "kind", state.kind);
  append(params, "status", state.status);
  append(params, "assetAvailability", normalizeAssetAvailability(state.assetAvailability));
  append(params, "cursor", cursor);
  return `/v1/search?${params.toString()}`;
}

export function mergeSearchRows<T extends { id: string }>(current: T[], incoming: T[]): T[] {
  const rows = new Map(current.map((row) => [row.id, row]));
  for (const row of incoming) rows.set(row.id, row);
  return [...rows.values()];
}

export function clearUnknownSearchFacets(
	state: ConsoleSearchState,
	facets: Record<string, Array<{ value: string }> | undefined>,
): ConsoleSearchState {
	const next = { ...state };
	for (const [stateKey, facetKey] of [
		["provider", "providers"],
		["tenant", "tenants"],
		["project", "projects"],
		["kind", "kinds"],
		["status", "statuses"],
		["assetAvailability", "assetAvailability"],
	] as const) {
		if (next[stateKey] && !facets[facetKey]?.some((option) => option.value === next[stateKey])) {
			next[stateKey] = "";
		}
	}
	return next;
}

export function calculateVirtualWindow(
  rowCount: number,
  scrollTop: number,
  viewportHeight: number,
  overscan = 5,
): { start: number; end: number; top: number; bottom: number } {
  const visibleStart = Math.max(0, Math.floor(scrollTop / SEARCH_ROW_HEIGHT));
  const visibleEnd = Math.min(rowCount, Math.ceil((scrollTop + viewportHeight) / SEARCH_ROW_HEIGHT));
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(rowCount, visibleEnd + overscan);
  return {
    start,
    end,
    top: start * SEARCH_ROW_HEIGHT,
    bottom: Math.max(0, (rowCount - end) * SEARCH_ROW_HEIGHT),
  };
}

export function encodeSearchRowId(rowId: string): string {
  if (!rowId) return "";
  const bytes = new TextEncoder().encode(rowId);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return globalThis.btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeSearchRowId(encoded: string): string {
  if (!encoded || !/^[A-Za-z0-9_-]+$/.test(encoded)) return "";
  try {
    const padded = encoded.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    const binary = globalThis.atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

function append(params: URLSearchParams, key: string, value: string): void {
  const normalized = value.trim();
  if (normalized) params.set(key, normalized);
}

function cleanRouteValue(value: string | null): string {
  const normalized = value?.trim() ?? "";
  return normalized.length <= 240 ? normalized : normalized.slice(0, 240);
}

function normalizeAssetAvailability(value: string): string {
  return value === "available" || value === "unavailable" || value === "pending" ? value : "";
}
