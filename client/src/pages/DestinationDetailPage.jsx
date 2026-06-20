import { ArrowLeft, BadgeCheck, ExternalLink, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAsync } from "../hooks/useAsync.js";

import { getVisitedStatesSet, markVisitedState } from "../utils/visitedProgress.js";

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const { loading, error, data } = useAsync(() => api(`/destinations/${slug}`), [slug]);
  const place = data?.destination;

  if (loading)
    return (
      <section className="section page-section">
        <p className="status">Loading destination...</p>
      </section>
    );
  if (error)
    return (
      <section className="section page-section">
        <p className="status error">{error}</p>
      </section>
    );
  if (!place)
    return (
      <section className="section page-section">
        <p className="status error">Destination not found.</p>
        <Link className="inline-link" to="/destinations">
          <ArrowLeft size={16} /> Back to destinations
        </Link>
      </section>
    );

  // Guest progress: mark the state as "visited" when this destination is opened
  if (place?.stateSlug) {
    const visited = getVisitedStatesSet();
    if (!visited.has(place.stateSlug)) markVisitedState(place.stateSlug);
  }

  return (
    <section className="section detail-panel">
      <Link className="inline-link" to="/destinations">
        <ArrowLeft size={16} /> Back to destinations
      </Link>
      <div className="detail-layout">
        <div>
          <p className="eyebrow">{place.category}</p>
          <h1>{place.name}</h1>
          <p className="detail-lede">{place.description}</p>
          <dl className="facts">
            <div>
              <dt>State</dt>
              <dd>{place.state}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{place.city}</dd>
            </div>
            <div>
              <dt>Best time</dt>
              <dd>{place.bestTime}</dd>
            </div>
            <div>
              <dt>Timings and fees</dt>
              <dd>{place.fees}</dd>
            </div>
          </dl>
          <h2>Nearby attractions</h2>
          <ul className="nearby-list">
            {place.nearby?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="detail-actions">
            <Link className="button compact" to="/map" aria-label="View map coverage">
              Coverage map
            </Link>
            <a className="button primary" href={place.map} target="_blank" rel="noreferrer">
              <MapPin size={17} /> Open map
            </a>
            {place.verified && (
              <span className="verified large">
                <BadgeCheck size={17} /> Verified record
              </span>
            )}
          </div>
        </div>
        <div className="gallery" aria-label="Image gallery">
          {place.images?.map((image) => (
            <a key={image} href={image} target="_blank" rel="noreferrer">
              <img src={image} alt={`${place.name} travel view`} loading="lazy" />
              <span>
                View image <ExternalLink size={14} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

