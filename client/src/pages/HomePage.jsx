import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import DestinationCard from "../components/DestinationCard.jsx";
import StateGrid from "../components/StateGrid.jsx";
import { useAsync } from "../hooks/useAsync.js";

export default function HomePage() {
  const meta = useAsync(() => api("/meta"), []);
  const destinations = useAsync(() => api("/destinations"), []);
  const featured = destinations.data?.destinations?.filter((place) => place.featured).slice(0, 3) || [];

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Incredible India, organized for curious travelers</p>
          <h1>TravelBharat</h1>
          <p>
            A full-stack tourism encyclopedia for discovering Indian destinations by state, city, culture,
            category, best season, and nearby attractions.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/destinations">
              Start exploring <ArrowRight size={17} />
            </Link>
            <Link className="button ghost" to="/admin">
              Admin dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="section stats-band" aria-label="Platform highlights">
        <div>
          <strong>{meta.data?.states?.length || 0}</strong>
          <span>States and UTs</span>
        </div>
        <div>
          <strong>{destinations.data?.destinations?.length || 0}</strong>
          <span>Curated places</span>
        </div>
        <div>
          <strong>{meta.data?.categories?.length || 0}</strong>
          <span>Core categories</span>
        </div>
        <div>
          <strong>JWT</strong>
          <span>Protected admin API</span>
        </div>
      </section>

      <section className="section feature-strip">
        <article>
          <ShieldCheck size={24} />
          <h2>Verified travel records</h2>
          <p>Destination data is structured for moderation, verification, and future production database use.</p>
        </article>
        <article>
          <Sparkles size={24} />
          <h2>Portfolio-grade foundation</h2>
          <p>React routes, Express APIs, MongoDB models, and admin auth make this much more than a static page.</p>
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Featured places</p>
          <h2>Start with iconic destinations</h2>
        </div>
        {destinations.loading && <p className="status">Loading destinations...</p>}
        {destinations.error && <p className="status error">{destinations.error}</p>}
        <div className="destination-grid">
          {featured.map((place) => (
            <DestinationCard key={place.slug} place={place} />
          ))}
        </div>
      </section>

      <section className="section states-band">
        <div className="section-heading">
          <p className="eyebrow">State-wise listings</p>
          <h2>Browse India through regional tourism clusters</h2>
        </div>
        <StateGrid states={meta.data?.states || []} />
      </section>
    </>
  );
}
