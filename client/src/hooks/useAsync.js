import { useEffect, useState } from "react";

export function useAsync(factory, deps = []) {
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    let alive = true;
    setState((current) => ({ ...current, loading: true, error: "" }));

    factory()
      .then((data) => {
        if (alive) setState({ loading: false, error: "", data });
      })
      .catch((error) => {
        if (alive) setState({ loading: false, error: error.message, data: null });
      });

    return () => {
      alive = false;
    };
  }, deps);

  return state;
}
