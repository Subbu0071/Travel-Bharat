import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import DestinationCard from "../components/DestinationCard.jsx";
import { useAsync } from "../hooks/useAsync.js";

export default function StatePage() {
  const { stateSlug } = useParams();
  const meta = useAsync(() => api("/meta"), []);
  const destinations = useAsync(() => api(`/destinations?state=${stateSlug}`), [stateSlug]);
  const state = meta.data?.states?.find((item) => item.slug === stateSlug);

  return (
    <section className="section page-section">
      <Link className="inline-link" to="/states">
        <ArrowLeft size={16} /> Back to states
      </Link>
      <div className="section-heading">
        <p className="eyebrow">State guide</p>
        <h1>{state?.name || "State destinations"}</h1>
      </div>
      {destinations.loading && <p className="status">Loading destinations...</p>}
      {destinations.error && <p className="status error">{destinations.error}</p>}
      <div className="destination-grid">
        {destinations.data?.destinations?.map((place) => (
          <DestinationCard key={place.slug} place={place} />
        ))}
      </div>
    </section>
  );
}
