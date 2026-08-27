import { Copy, Download, ExternalLink, Loader2, RefreshCcw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildConsoleSearchLocation,
  buildSearchRequestUrl,
  calculateVirtualWindow,
  clearUnknownSearchFacets,
  mergeSearchRows,
  readConsoleSearchRoute,
  SEARCH_ROW_HEIGHT,
} from "./search.ts";

const EMPTY_RESULT = {
  generatedAt: null,
  rows: [],
  nextCursor: null,
  metrics: { total: 0, returned: 0 },
  facets: {
    providers: [],
    tenants: [],
    projects: [],
    kinds: [],
    statuses: [],
    assetAvailability: [],
  },
};

export default function SearchPage() {
  const initialRoute = useMemo(() => readConsoleSearchRoute(window.location.search), []);
  const [filters, setFilters] = useState(initialRoute.state);
  const [result, setResult] = useState(EMPTY_RESULT);
  const [selectedRowId, setSelectedRowId] = useState(initialRoute.rowId);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [copyNotice, setCopyNotice] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const viewportRef = useRef(null);
  const requestSequence = useRef(0);

  const selectedRow = useMemo(
    () => result.rows.find((row) => row.id === selectedRowId) ?? result.rows[0] ?? null,
    [result.rows, selectedRowId],
  );
  const virtualWindow = calculateVirtualWindow(result.rows.length, scrollTop, 520);
  const visibleRows = result.rows.slice(virtualWindow.start, virtualWindow.end);

  const replaceRoute = (nextFilters, rowId = selectedRowId) => {
    window.history.replaceState(null, "", buildConsoleSearchLocation(window.location.pathname, nextFilters, rowId));
  };

  const load = async ({ cursor = "", append = false } = {}) => {
    const sequence = ++requestSequence.current;
    append ? setLoadingMore(true) : setLoading(true);
    setError("");
    try {
      const response = await fetch(buildSearchRequestUrl(filters, cursor));
      if (!response.ok) throw new Error(await readError(response));
      const payload = await response.json();
      if (sequence !== requestSequence.current) return;
			const validatedFilters = clearUnknownSearchFacets(filters, payload.facets ?? {});
			if (JSON.stringify(validatedFilters) !== JSON.stringify(filters)) setFilters(validatedFilters);
      setResult((current) => ({
        ...payload,
        rows: append ? mergeSearchRows(current.rows, payload.rows ?? []) : payload.rows ?? [],
      }));
      if (!append) setScrollTop(0);
    } catch (requestError) {
      if (sequence === requestSequence.current) {
        setError(requestError instanceof Error ? requestError.message : String(requestError));
      }
    } finally {
      if (sequence === requestSequence.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 220);
    replaceRoute(filters, selectedRowId);
    return () => window.clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    if (!selectedRow) return;
    if (selectedRow.id !== selectedRowId) setSelectedRowId(selectedRow.id);
    replaceRoute(filters, selectedRow.id);
  }, [selectedRow?.id]);

  const updateFilter = (key, value) => {
    setSelectedRowId("");
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const selectRow = (rowId) => {
    setSelectedRowId(rowId);
    replaceRoute(filters, rowId);
  };

  const moveSelection = (direction) => {
    if (result.rows.length === 0) return;
    const currentIndex = Math.max(0, result.rows.findIndex((row) => row.id === selectedRow?.id));
    const nextIndex = Math.max(0, Math.min(result.rows.length - 1, currentIndex + direction));
    selectRow(result.rows[nextIndex].id);
    viewportRef.current?.querySelector(`[data-row-index="${nextIndex}"]`)?.scrollIntoView({ block: "nearest" });
  };

  const copyLink = async () => {
    const link = new URL(buildConsoleSearchLocation(window.location.pathname, filters, selectedRow?.id), window.location.origin).href;
    await navigator.clipboard.writeText(link);
    setCopyNotice("Search link copied");
    window.setTimeout(() => setCopyNotice(""), 1800);
  };

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Search</h1>
          <p>Find mirrored conversations, artifacts, files, projects, and run evidence across every tenant.</p>
          <span className="freshness">
            {loading ? "Loading newest records" : `Projection refreshed ${formatTime(result.generatedAt)}`}
          </span>
        </div>
        <div className="header-actions">
          <button className="ghost-button" type="button" onClick={copyLink} disabled={!selectedRow}>
            <Copy size={16} aria-hidden="true" />
            {copyNotice || "Copy link"}
          </button>
          <button className="primary-button" type="button" onClick={() => void load()} disabled={loading}>
            <RefreshCcw size={16} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </section>

      <section className="status-strip search-status-strip" aria-label="Search result summary">
        <Metric label="Matches" value={result.metrics?.total ?? 0} />
        <Metric label="Loaded" value={result.rows.length} />
        <Metric label="Providers" value={result.facets?.providers?.length ?? 0} />
        <Metric label="Tenants" value={result.facets?.tenants?.length ?? 0} />
      </section>

      {error ? <div className="notice error"><strong>Search unavailable</strong><p>{error}</p></div> : null}

      <section className="search-workspace">
        <section className="search-results-panel" aria-label="Search results workbench">
          <div className="search-command-bar">
            <label className="search-field search-query-field">
              <Search size={15} aria-hidden="true" />
              <span className="sr-only">Search all records</span>
              <input
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                placeholder="Search titles, summaries, ids, or evidence"
              />
            </label>
            <Facet label="Provider" value={filters.provider} values={result.facets?.providers} onChange={(value) => updateFilter("provider", value)} />
            <Facet label="Tenant" value={filters.tenant} values={result.facets?.tenants} onChange={(value) => updateFilter("tenant", value)} />
            <Facet label="Kind" value={filters.kind} values={result.facets?.kinds} onChange={(value) => updateFilter("kind", value)} />
            <Facet label="Status" value={filters.status} values={result.facets?.statuses} onChange={(value) => updateFilter("status", value)} />
            <Facet label="Project" value={filters.project} values={result.facets?.projects} onChange={(value) => updateFilter("project", value)} />
            <Facet label="Asset" value={filters.assetAvailability} values={result.facets?.assetAvailability} onChange={(value) => updateFilter("assetAvailability", value)} />
          </div>

          {loading ? (
            <div className="loading-state"><Loader2 className="spin" size={18} aria-hidden="true" />Loading search projection</div>
          ) : result.rows.length === 0 ? (
            <div className="empty-state"><Search size={22} aria-hidden="true" /><strong>No records found</strong><p>Clear one or more filters and try again.</p></div>
          ) : (
            <div
              className="search-viewport"
              ref={viewportRef}
              role="grid"
              aria-label="Search results, newest first"
              aria-rowcount={result.metrics?.total ?? result.rows.length}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  moveSelection(event.key === "ArrowDown" ? 1 : -1);
                }
              }}
              onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
            >
              <div className="search-table-head" role="row">
                <span role="columnheader">Record</span><span role="columnheader">Kind</span><span role="columnheader">Provider</span>
                <span role="columnheader">Tenant / project</span><span role="columnheader">Status</span><span role="columnheader">Updated</span>
              </div>
              <div style={{ height: virtualWindow.top }} aria-hidden="true" />
              {visibleRows.map((row, offset) => {
                const index = virtualWindow.start + offset;
                return (
                  <button
                    className={row.id === selectedRow?.id ? "search-result-row selected" : "search-result-row"}
                    type="button"
                    role="row"
                    aria-rowindex={index + 2}
                    aria-selected={row.id === selectedRow?.id}
                    data-row-index={index}
                    key={row.id}
                    onClick={() => selectRow(row.id)}
                  >
                    <span className="search-title-cell" role="gridcell"><strong>{row.title || row.itemId || "Untitled record"}</strong><small>{row.summary || row.itemId || row.id}</small></span>
                    <span role="gridcell">{humanize(row.kind)}</span>
                    <span role="gridcell">{humanize(row.provider)}</span>
                    <span className="search-context-cell" role="gridcell"><strong>{row.tenant || "Unbound tenant"}</strong><small>{row.projectId || "No project"}</small></span>
                    <span role="gridcell"><StatusPill value={row.status || row.runtimeState} /></span>
                    <span role="gridcell">{formatTime(row.sortTime || row.updatedAt)}</span>
                  </button>
                );
              })}
              <div style={{ height: virtualWindow.bottom }} aria-hidden="true" />
            </div>
          )}
          {result.nextCursor ? (
            <button className="search-load-more" type="button" onClick={() => void load({ cursor: result.nextCursor, append: true })} disabled={loadingMore}>
              {loadingMore ? <Loader2 className="spin" size={16} aria-hidden="true" /> : null}
              {loadingMore ? "Loading" : "Load more records"}
            </button>
          ) : null}
        </section>

        <aside className="inspector search-inspector" aria-label="Selected search result inspector">
          <SearchInspector row={selectedRow} onCopy={copyLink} />
        </aside>
      </section>
    </>
  );
}

function Facet({ label, value, values = [], onChange }) {
  const options = value && !values.some((option) => option.value === value)
    ? [{ value, count: null }, ...values]
    : values;
  return (
    <label className="field compact-field search-facet">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => <option value={option.value} key={option.value}>{humanize(option.value)}{option.count === null ? "" : ` (${option.count})`}</option>)}
      </select>
    </label>
  );
}

function SearchInspector({ row, onCopy }) {
  if (!row) return <div className="empty-state"><Search size={22} aria-hidden="true" /><strong>Select a record</strong><p>Use the result table or arrow keys to inspect evidence.</p></div>;
  const metadata = row.metadata ?? {};
  const lineage = [metadata.responseId, metadata.batchId, metadata.agentId, metadata.teamId].filter(Boolean);
  return (
    <div className="inspector-inner">
      <div className="inspector-title"><span className="eyebrow">{humanize(row.kind)} · {humanize(row.source)}</span><h2>{row.title || row.itemId || "Untitled record"}</h2><p>{row.summary || "No summary is available for this record."}</p></div>
      <div className="inspector-card">
        <h3>Record context</h3>
        <dl className="details-list">
          <dt>Provider</dt><dd>{humanize(row.provider)}</dd>
          <dt>Tenant</dt><dd>{row.tenant || "Unbound"}</dd>
          <dt>Project</dt><dd>{row.projectId || "None"}</dd>
          <dt>Status</dt><dd>{humanize(row.status || row.runtimeState)}</dd>
          <dt>Updated</dt><dd>{formatTime(row.updatedAt || row.sortTime)}</dd>
          <dt>Evidence</dt><dd>{describeCounts(row.counts)}</dd>
        </dl>
      </div>
      <div className="inspector-card">
        <h3>Lineage</h3>
        <p className="summary-line">{lineage.length ? lineage.join(" · ") : row.itemId || row.id}</p>
      </div>
      <div className="search-inspector-actions">
        <button type="button" onClick={onCopy}><Copy size={15} aria-hidden="true" />Copy stable link</button>
        {safeExternalUrl(row.links?.provider) ? <a href={row.links.provider} target="_blank" rel="noreferrer"><ExternalLink size={15} aria-hidden="true" />Open provider</a> : null}
        {safeLocalUrl(row.links?.asset) ? <a href={row.links.asset} download><Download size={15} aria-hidden="true" />Download cached asset</a> : null}
        {safeLocalUrl(row.links?.archiveItem || row.links?.catalogItem) ? <a href={row.links.archiveItem || row.links.catalogItem} target="_blank" rel="noreferrer"><ExternalLink size={15} aria-hidden="true" />Open API record</a> : null}
      </div>
      <details className="inspector-card raw-search-details"><summary>Raw evidence</summary><pre>{JSON.stringify({ links: row.links, metadata }, null, 2)}</pre></details>
    </div>
  );
}

function Metric({ label, value }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function StatusPill({ value }) {
  const normalized = String(value || "unknown").toLowerCase();
  const tone = /fail|error|stranded|missing/.test(normalized) ? "warning" : /succeed|complete|ready|cached|eligible/.test(normalized) ? "ready" : "draft";
  return <span className={`status-pill ${tone}`}>{humanize(value)}</span>;
}

function describeCounts(counts = {}) {
  return [`${counts.messages ?? 0} messages`, `${counts.files ?? 0} files`, `${counts.artifacts ?? 0} artifacts`].join(" · ");
}

function humanize(value) {
  if (!value) return "Unknown";
  return String(value).replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(value) {
  if (!value) return "Not reported";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function safeExternalUrl(value) {
  return typeof value === "string" && /^https:\/\//i.test(value);
}

function safeLocalUrl(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

async function readError(response) {
  try {
    const payload = await response.json();
    return payload?.error?.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}
