import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAsync } from "../hooks/useAsync.js";
import { clearVisitedStates, getVisitedStatesSet } from "../utils/visitedProgress.js";

import "./MapCoveragePage.css";


function getCoveragePct(visitedCount, totalCount) {

  if (!totalCount) return 0;
  return Math.round((visitedCount / totalCount) * 100);
}

function bucketStates(states, visitedStates) {
  const visited = [];
  const notVisited = [];
  for (const s of states) {
    (visitedStates.has(s.slug) ? visited : notVisited).push(s);
  }
  return { visited, notVisited };
}

export default function MapCoveragePage() {
  const meta = useAsync(() => api("/meta"), []);
  const [query, setQuery] = useState("");

  const states = meta.data?.states || [];

  const [visitedStates, setVisitedStates] = useState(() => getVisitedStatesSet());

  // keep in sync when the meta payload loads/reloads
  useMemo(() => {
    setVisitedStates(getVisitedStatesSet());
  }, [meta.data]);




  const { visited, notVisited } = useMemo(() => bucketStates(states, visitedStates), [states, visitedStates]);



  const totalStates = states.length;
  const visitedCount = visited.length;
  const coveragePct = getCoveragePct(visitedCount, totalStates);

  const filteredVisited = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return visited;
    return visited.filter((s) => s.name.toLowerCase().includes(term));
  }, [visited, query]);

  const filteredNotVisited = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return notVisited;
    return notVisited.filter((s) => s.name.toLowerCase().includes(term));
  }, [notVisited, query]);

  return (
    <section className="section page-section">
      <div className="section-heading">
        <p className="eyebrow">Progress map</p>
        <h1>India coverage glow</h1>
        <p style={{ marginTop: 10, color: "var(--muted)", fontWeight: 750 }}>
          {coveragePct}% covered • {visitedCount}/{totalStates} states
        </p>
      </div>

      <div className="coverage-hero" aria-label="Coverage summary">
        <div className="coverage-ring" role="img" aria-label={`Coverage ring ${coveragePct}%`}>
          <div className="coverage-ring-inner">
            <span className="coverage-pct">{coveragePct}%</span>
            <span className="coverage-sub">glow achieved</span>
          </div>
          <div
            className="coverage-ring-progress"
            style={{
              // CSS variable for progress arc/gradient
              // eslint-disable-next-line react/forbid-dom-props
              "--progress": `${coveragePct}%`
            }}
          />
        </div>

        <div className="coverage-controls">
          <label className="coverage-search">
            <span>Find a state</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search: Kerala, Rajasthan..." />
          </label>

          <div className="coverage-badges">
            <div className="coverage-badge visited">
              <span className="dot" /> Visited: {filteredVisited.length}
            </div>
            <div className="coverage-badge">
              <span className="dot dim" /> Not visited: {filteredNotVisited.length}
            </div>
            <button
              type="button"
              className="button compact"
              onClick={() => {
                if (window.confirm("Clear all visited states progress?")) {
                  clearVisitedStates();
                  setQuery((q) => q + "");
                }
              }}
              aria-label="Clear visited states progress"
            >
              Reset glow
            </button>
          </div>



          <Link className="button primary" to="/destinations">
            Explore destinations <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="coverage-map-shell" aria-label="Coverage by state">
        <div className="coverage-column">
          <h2 className="coverage-col-title">Visited (glowing)</h2>
          <div className="coverage-state-grid">
            {filteredVisited.map((s) => (
              <div key={s.slug} className="state-chip-wrap">
                <Link
                  to={`/states/${s.slug}`}
                  className="state-chip visited"
                  aria-label={`Visited state ${s.name}`}
                >
                  <span className="chip-name">{s.name}</span>
                  <span className="chip-spark" aria-hidden="true">
                    ✦
                  </span>
                </Link>
                <button
                  type="button"
                  className="chip-remove"
                  aria-label={`Remove ${s.name} from glow`}
                  title="Remove from glow"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove from visited set
                    const next = new Set(getVisitedStatesSet());
                    next.delete(s.slug);
                    try {
                      localStorage.setItem(
                        "tb-visited-states",
                        JSON.stringify([...next])
                      );
                    } catch {}
                    setVisitedStates(next);
                    setQuery((q) => q + "");
                  }}

                >
                  ×
                </button>
              </div>
            ))}

            {filteredVisited.length === 0 ? <div className="coverage-empty">No matches.</div> : null}
          </div>
        </div>

        <div className="coverage-column">
          <h2 className="coverage-col-title">To explore</h2>
          <div className="coverage-state-grid">
            {filteredNotVisited.map((s) => (
              <button
                key={s.slug}
                type="button"
                className="state-chip addable"
                aria-label={`Mark ${s.name} as visited`}
                title="Add to glow"
                onClick={() => {
                  try {
                    // Mark visited locally without navigating away.
                    const next = new Set(getVisitedStatesSet());
                    next.add(s.slug);
                    try {
                      localStorage.setItem("tb-visited-states", JSON.stringify([...next]));
                    } catch {}
                    setVisitedStates(next);
                    setQuery((q) => q + "");
                  } catch {}
                }}

              >
                <span className="chip-name">{s.name}</span>
                <span className="chip-arrow" aria-hidden="true">
                  +
                </span>
              </button>
            ))}

            {filteredNotVisited.length === 0 ? <div className="coverage-empty">No matches.</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}


