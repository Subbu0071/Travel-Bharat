import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function StateGrid({ states = [] }) {
  return (
    <div className="state-grid">
      {states.map((state) => (
        <Link className="state-card" key={state.slug} to={`/states/${state.slug}`}>
          <h3>{state.name}</h3>
          <p>
            <strong>{state.count}</strong> curated destination{state.count === 1 ? "" : "s"}
          </p>
          <span>
            Explore state <ArrowRight size={16} />
          </span>
        </Link>
      ))}
    </div>
  );
}
