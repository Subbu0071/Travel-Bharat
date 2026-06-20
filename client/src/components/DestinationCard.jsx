import { ArrowRight, BadgeCheck, Heart, Share2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const FAV_KEY = "tb-favs";

export default function DestinationCard({ place }) {
  const image = place.images?.[0] || "/placeholder.jpg";
  const [favorited, setFavorited] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setFavorited(list.includes(place.slug));
    } catch {
      setFavorited(false);
    }
  }, [place.slug]);

  function toggleFavorite(e) {
    e?.stopPropagation();
    e?.preventDefault();
    try {
      const raw = localStorage.getItem(FAV_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const idx = list.indexOf(place.slug);
      let next;
      if (idx === -1) {
        next = [...list, place.slug];
        setFavorited(true);
        setToast("Added to favorites");
      } else {
        next = list.slice(0, idx).concat(list.slice(idx + 1));
        setFavorited(false);
        setToast("Removed from favorites");
      }
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
    } catch (err) {
      setToast("Could not update favorites");
      console.error(err);
    }
    clearToastLater();
  }

  async function handleShare(e) {
    e?.stopPropagation();
    e?.preventDefault();
    const url = `${window.location.origin}/destinations/${place.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, text: place.description, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setToast("Link copied to clipboard");
        clearToastLater();
      } else {
        // fallback: open prompt
        window.prompt("Copy this link:", url);
      }
    } catch (err) {
      setToast("Could not share");
      clearToastLater();
      console.error(err);
    }
  }

  function clearToastLater() {
    setTimeout(() => setToast(""), 2200);
  }

  return (
    <article className="destination-card" tabIndex={0} aria-labelledby={`dest-${place.slug}-title`}>
      <div className="card-media">
        <img src={image} alt={place.name || place.slug} loading="lazy" />

        <div className="card-overlay" aria-hidden="true">
          <button
            type="button"
            className={`icon-button ${favorited ? "favorited" : ""}`}
            title={favorited ? "Remove favorite" : "Add favorite"}
            aria-pressed={favorited}
            aria-label={`${favorited ? "Remove" : "Add"} ${place.name} to favorites`}
            onClick={toggleFavorite}
          >
            <Heart size={16} />
          </button>
          <button type="button" className="icon-button" title="Share" aria-label={`Share ${place.name}`} onClick={handleShare}>
            <Share2 size={16} />
          </button>
          <Link className="button ghost quick-view" to={`/destinations/${place.slug}`} aria-label={`Open ${place.name}`}>
            <Eye size={14} /> Quick view
          </Link>
        </div>
        {toast && <div className="card-toast" role="status">{toast}</div>}
      </div>

      <div className="card-body">
        <div className="card-topline">
          <span className="tag">{place.category}</span>
          {place.verified && (
            <span className="verified">
              <BadgeCheck size={15} /> Verified
            </span>
          )}
        </div>
        <h3 id={`dest-${place.slug}-title`}>{place.name}</h3>
        <div className="card-meta">
          <span>{place.city}</span>
          <span>{place.state}</span>
        </div>
        <p>{place.description}</p>
        <Link className="button compact" to={`/destinations/${place.slug}`}>
          View details <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
