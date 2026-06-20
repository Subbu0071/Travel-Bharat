import { useEffect, useState } from "react";
import DestinationCard from "../components/DestinationCard.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { api } from "../api.js";

export default function FavoritesPage() {
  const FAV_KEY = "tb-favs";
  const [favList, setFavList] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      setFavList(raw ? JSON.parse(raw) : []);
    } catch {
      setFavList([]);
    }
  }, []);

  const all = useAsync(() => api(`/destinations`), []);

  const favorites = (all.data?.destinations || []).filter((d) => favList.includes(d.slug));

  return (
    <section className="section page-section">
      <div className="section-heading">
        <p className="eyebrow">Saved places</p>
        <h1>Your favorite destinations</h1>
      </div>

      {all.loading && <p className="status">Loading favorites...</p>}
      {all.error && <p className="status error">{all.error}</p>}

      {!all.loading && !all.error && (
        <>
          <p className="results-meta">{favorites.length} favorites</p>

          {favorites.length === 0 ? (
            <p className="status">You haven't added any favorites yet. Click the heart on a destination to save it.</p>
          ) : (
            <div className="destination-grid">
              {favorites.map((place) => (
                <DestinationCard key={place.slug} place={place} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
