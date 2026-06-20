import { useMemo, useState } from "react";
import { api, toQuery } from "../api.js";
import DestinationCard from "../components/DestinationCard.jsx";
import Filters from "../components/Filters.jsx";
import StateGrid from "../components/StateGrid.jsx";
import { useAsync } from "../hooks/useAsync.js";

const emptyFilters = {
  search: "",
  state: "",
  city: "",
  category: ""
};

export default function DestinationsPage({ mode }) {
  const [filters, setFilters] = useState(emptyFilters);
  const meta = useAsync(() => api("/meta"), []);
  const query = useMemo(() => toQuery(filters), [filters]);
  const destinations = useAsync(() => api(`/destinations${query ? `?${query}` : ""}`), [query]);

  const updateFilters = (next) => setFilters((current) => ({ ...current, ...next }));

  if (mode === "states") {
    return (
      <section className="section page-section">
        <div className="section-heading">
          <p className="eyebrow">States and UTs</p>
          <h1>Explore TravelBharat state by state</h1>
        </div>
        {meta.loading && <p className="status">Loading states...</p>}
        {meta.error && <p className="status error">{meta.error}</p>}
        <StateGrid states={meta.data?.states || []} />
      </section>
    );
  }

  return (
    <section className="section page-section">
      <div className="section-heading">
        <p className="eyebrow">Search and discovery</p>
        <h1>Find destinations by state, city, or category</h1>
      </div>

      <Filters
        filters={filters}
        meta={meta.data || { states: [], cities: [], categories: [] }}
        onChange={updateFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      {destinations.loading && <p className="status">Loading destinations...</p>}
      {destinations.error && <p className="status error">{destinations.error}</p>}
      {!destinations.loading && !destinations.error && (
        <p className="results-meta">{destinations.data?.destinations?.length || 0} destinations found</p>
      )}
      <div className="destination-grid">
        {destinations.data?.destinations?.map((place) => (
          <DestinationCard key={place.slug} place={place} />
        ))}
      </div>
    </section>
  );
}

