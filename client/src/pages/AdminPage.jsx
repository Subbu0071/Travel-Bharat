import {
  Edit3,
  Eye,
  LogIn,
  LogOut,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, clearToken, getToken, setToken } from "../api.js";
import { useAsync } from "../hooks/useAsync.js";

const blankDestination = {
  name: "",
  state: "",
  city: "",
  category: "Heritage",
  description: "",
  bestTime: "",
  fees: "",
  map: "",
  images: "",
  nearby: "",
  verified: true,
  featured: false
};

export default function AdminPage() {
  const [session, setSession] = useState(() => Boolean(getToken()));
  const [login, setLogin] = useState({ email: "admin@travelbharat.local", password: "TravelBharat@123" });
  const [form, setForm] = useState(blankDestination);
  const [editingSlug, setEditingSlug] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const destinations = useAsync(() => api("/destinations"), [refreshKey]);
  const records = destinations.data?.destinations || [];

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter((place) =>
      [place.name, place.state, place.city, place.category, place.description].join(" ").toLowerCase().includes(term)
    );
  }, [records, search]);

  const stats = useMemo(() => {
    const states = new Set(records.map((place) => place.state));
    const verified = records.filter((place) => place.verified).length;
    const featured = records.filter((place) => place.featured).length;
    return { total: records.length, states: states.size, verified, featured };
  }, [records]);

  const imagePreview = form.images
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  useEffect(() => {
    document.title = "Admin Dashboard | TravelBharat";
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setStatus("");
    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(login)
      });
      setToken(result.token);
      setSession(true);
      setStatus("Admin login successful.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function logout() {
    clearToken();
    setSession(false);
    cancelEdit();
    setStatus("Logged out.");
  }

  function toPayload() {
    return {
      ...form,
      images: form.images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      nearby: form.nearby
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };
  }

  async function saveDestination(event) {
    event.preventDefault();
    setStatus("");

    try {
      const payload = toPayload();
      const path = editingSlug ? `/admin/destinations/${editingSlug}` : "/admin/destinations";
      const method = editingSlug ? "PUT" : "POST";
      const result = await api(path, {
        method,
        body: JSON.stringify(payload)
      });

      setForm(blankDestination);
      setEditingSlug("");
      setRefreshKey((key) => key + 1);
      setStatus(
        method === "PUT"
          ? `${result.destination.name} saved through the backend API.`
          : `${result.destination.name} added through the backend API.`
      );
    } catch (error) {
      setStatus(error.message);
    }
  }

  function startEdit(place) {
    setEditingSlug(place.slug);
    setForm({
      name: place.name,
      state: place.state,
      city: place.city,
      category: place.category,
      description: place.description,
      bestTime: place.bestTime,
      fees: place.fees,
      map: place.map,
      images: place.images?.join(", ") || "",
      nearby: place.nearby?.join(", ") || "",
      verified: Boolean(place.verified),
      featured: Boolean(place.featured)
    });
    setStatus(`Editing ${place.name}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingSlug("");
    setForm(blankDestination);
  }

  async function deleteDestination(slug, name) {
    setStatus("");
    try {
      await api(`/admin/destinations/${slug}`, { method: "DELETE" });
      if (editingSlug === slug) cancelEdit();
      setRefreshKey((key) => key + 1);
      setStatus(`${name} deleted.`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  function appendImageUrl(url) {
    setForm((current) => ({
      ...current,
      images: [current.images, url].filter(Boolean).join(current.images ? ", " : "")
    }));
  }

  function handleImageFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 700_000) {
      setStatus("Choose an image under 700 KB for local demo upload, or paste a hosted image URL.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      appendImageUrl(reader.result);
      setStatus(`${file.name} added as a local preview image. Use Cloudinary in production.`);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <section className="section page-section admin-page">
      <div className="section-heading">
        <p className="eyebrow">Admin management</p>
        <h1>Secure destination dashboard</h1>
      </div>

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <ShieldCheck size={24} />
          <h2>Backend protected</h2>
          <p>Admin writes go through JWT-authenticated Express routes. MongoDB is supported through `MONGO_URI`.</p>
          <div className="admin-stats">
            <div>
              <strong>{stats.total}</strong>
              <span>records</span>
            </div>
            <div>
              <strong>{stats.states}</strong>
              <span>states</span>
            </div>
            <div>
              <strong>{stats.verified}</strong>
              <span>verified</span>
            </div>
            <div>
              <strong>{stats.featured}</strong>
              <span>featured</span>
            </div>
          </div>
          {session ? (
            <button className="button compact" type="button" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          ) : null}
        </aside>

        <div className="admin-main">
          {!session ? (
            <form className="admin-form compact-form" onSubmit={handleLogin}>
              <label>
                <span>Email</span>
                <input
                  value={login.email}
                  onChange={(event) => setLogin((current) => ({ ...current, email: event.target.value }))}
                  type="email"
                  required
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  value={login.password}
                  onChange={(event) => setLogin((current) => ({ ...current, password: event.target.value }))}
                  type="password"
                  required
                />
              </label>
              <button className="button primary wide" type="submit">
                <LogIn size={17} /> Login
              </button>
            </form>
          ) : (
            <form className="admin-form" onSubmit={saveDestination}>
              <div className="form-title wide">
                <div>
                  <p className="eyebrow">{editingSlug ? "Edit record" : "New record"}</p>
                  <h2>{editingSlug ? form.name || "Editing destination" : "Add destination"}</h2>
                </div>
                {editingSlug ? (
                  <button className="button compact" type="button" onClick={cancelEdit}>
                    <X size={16} /> Cancel edit
                  </button>
                ) : null}
              </div>

              <Field label="Place name" name="name" form={form} setForm={setForm} placeholder="Gateway of India" />
              <Field label="State or UT" name="state" form={form} setForm={setForm} placeholder="Maharashtra" />
              <Field label="City" name="city" form={form} setForm={setForm} placeholder="Mumbai" />
              <label>
                <span>Category</span>
                <select
                  name="category"
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                >
                  <option>Heritage</option>
                  <option>Nature</option>
                  <option>Adventure</option>
                  <option>Religious</option>
                </select>
              </label>
              <label className="wide">
                <span>Description and significance</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  required
                  rows="4"
                  placeholder="Write verified destination details..."
                />
              </label>
              <Field label="Best time to visit" name="bestTime" form={form} setForm={setForm} placeholder="October to March" />
              <Field label="Entry fees and timings" name="fees" form={form} setForm={setForm} placeholder="Open daily, fee varies" />
              <Field label="Map link" name="map" form={form} setForm={setForm} placeholder="https://maps.google.com/..." type="url" />
              <label className="wide">
                <span>Image URLs</span>
                <textarea
                  name="images"
                  value={form.images}
                  onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))}
                  required
                  rows="3"
                  placeholder="https://image-1, https://image-2"
                />
              </label>
              <label className="file-control">
                <span>Local demo image</span>
                <input type="file" accept="image/*" onChange={handleImageFile} />
              </label>
              <Field label="Nearby attractions" name="nearby" form={form} setForm={setForm} placeholder="Museum, Fort, Lake" wide />

              {imagePreview.length ? (
                <div className="image-preview wide" aria-label="Image preview">
                  {imagePreview.map((image) => (
                    <img key={image} src={image} alt="Destination preview" />
                  ))}
                </div>
              ) : null}

              <label className="check-row">
                <input
                  name="verified"
                  checked={form.verified}
                  onChange={(event) => setForm((current) => ({ ...current, verified: event.target.checked }))}
                  type="checkbox"
                />
                <span>Mark as verified</span>
              </label>
              <label className="check-row">
                <input
                  name="featured"
                  checked={form.featured}
                  onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                  type="checkbox"
                />
                <span>Feature on homepage</span>
              </label>
              <button className="button primary wide" type="submit">
                {editingSlug ? <Save size={17} /> : <Plus size={17} />}
                {editingSlug ? "Update destination" : "Add destination"}
              </button>
            </form>
          )}

          {status && (
            <p className="admin-note" role="status">
              {status}
            </p>
          )}

          <div className="admin-list">
            <div className="list-heading">
              <h2>Destination records</h2>
              <label className="record-search">
                <span>Search records</span>
                <div className="input-icon">
                  <Search size={17} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter admin records..." />
                </div>
              </label>
            </div>
            {destinations.loading && <p className="status">Loading records...</p>}
            {filteredRecords.map((place) => (
              <article className="record-row" key={place.slug}>
                <img src={place.images?.[0]} alt={place.name} />
                <div>
                  <strong>{place.name}</strong>
                  <span>
                    {place.city}, {place.state} - {place.category}
                  </span>
                  <small>
                    {place.verified ? "Verified" : "Draft"} {place.featured ? "- Featured" : ""}
                  </small>
                </div>
                <div className="record-actions">
                  <Link className="icon-button neutral" to={`/destinations/${place.slug}`} aria-label={`View ${place.name}`}>
                    <Eye size={17} />
                  </Link>
                  {session && (
                    <>
                      <button className="icon-button neutral" type="button" onClick={() => startEdit(place)} aria-label={`Edit ${place.name}`}>
                        <Edit3 size={17} />
                      </button>
                      <button className="icon-button" type="button" onClick={() => deleteDestination(place.slug, place.name)} aria-label={`Delete ${place.name}`}>
                        <Trash2 size={17} />
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
            {!destinations.loading && filteredRecords.length === 0 ? <p className="status">No records match your filter.</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, form, setForm, placeholder, type = "text", wide = false }) {
  return (
    <label className={wide ? "wide" : ""}>
      <span>{label}</span>
      <input
        name={name}
        value={form[name]}
        onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
        placeholder={placeholder}
        type={type}
        required
      />
    </label>
  );
}
