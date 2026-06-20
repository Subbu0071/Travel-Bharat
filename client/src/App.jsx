import { Compass, LayoutDashboard, Map, Search } from "lucide-react";
import { NavLink, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage.jsx";
import DestinationDetailPage from "./pages/DestinationDetailPage.jsx";
import DestinationsPage from "./pages/DestinationsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import StatePage from "./pages/StatePage.jsx";
import MapCoveragePage from "./pages/MapCoveragePage.jsx";
import ScrollToTopOnRouteChange from "./utils/scrollToTopOnRouteChange.js";

export default function App() {
  // simple dark mode toggle persisted to localStorage
  const toggleDark = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    try { localStorage.setItem("tb-dark", isDark ? "1" : "0"); } catch {}
  };

  // initialize theme on first render
  if (typeof window !== "undefined") {
    try {
      const pref = localStorage.getItem("tb-dark");
      if (pref === "1") document.documentElement.classList.add("dark");
    } catch {}
  }

  return (
    <>
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="TravelBharat home">
          <img className="brand-logo" src="/logo.png" alt="TravelBharat logo" />



          <span>TravelBharat</span>
        </NavLink>

        <nav className="nav" aria-label="Primary navigation">
          <NavLink to="/destinations">
            <Search size={17} /> Explore
          </NavLink>
          <NavLink to="/states">
            <Map size={17} /> States
          </NavLink>
          <NavLink to="/map">
            <Map size={17} /> Coverage
          </NavLink>
          <NavLink to="/admin">
            <LayoutDashboard size={17} /> Admin
          </NavLink>

          <button className="icon-button neutral" onClick={toggleDark} title="Toggle dark mode" aria-label="Toggle dark mode">
            {/* simple sun/moon glyph via emoji for wide compatibility */}
            <span aria-hidden="true">🌓</span>
          </button>
        </nav>
      </header>

      <main>
        <ScrollToTopOnRouteChange />
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="/states" element={<DestinationsPage mode="states" />} />
          <Route path="/states/:stateSlug" element={<StatePage />} />
          <Route path="/map" element={<MapCoveragePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <Compass size={18} />
        <p>TravelBharat supports structured tourism research, domestic travel awareness, and scalable future integrations.</p>
      </footer>
    </>
  );
}
