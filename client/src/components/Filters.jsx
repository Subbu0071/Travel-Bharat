import { RotateCcw, Search } from "lucide-react";

export default function Filters({ filters, meta, onChange, onReset }) {
  return (
    <div className="filters" role="search">
      <label>
        <span>Search</span>
        <div className="input-icon">
          <Search size={17} />
          <input
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            type="search"
            placeholder="Taj Mahal, Rajasthan, nature..."
          />
        </div>
      </label>
      <label>
        <span>State</span>
        <select value={filters.state} onChange={(event) => onChange({ state: event.target.value, city: "" })}>
          <option value="">All states and UTs</option>
          {meta.states?.map((state) => (
            <option key={state.slug} value={state.slug}>
              {state.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>City</span>
        <select value={filters.city} onChange={(event) => onChange({ city: event.target.value })}>
          <option value="">All cities</option>
          {meta.cities
            ?.filter((city) => !filters.state || city.stateSlug === filters.state)
            .map((city) => (
              <option key={`${city.stateSlug}-${city.slug}`} value={city.slug}>
                {city.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        <span>Category</span>
        <select value={filters.category} onChange={(event) => onChange({ category: event.target.value })}>
          <option value="">All categories</option>
          {meta.categories?.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <button className="button compact filter-reset" type="button" onClick={onReset}>
        <RotateCcw size={16} /> Reset
      </button>
    </div>
  );
}
