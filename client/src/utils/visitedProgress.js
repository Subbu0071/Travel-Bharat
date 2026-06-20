const VISITED_STATES_KEY = "tb-visited-states";


export function getVisitedStatesSet() {
  try {
    const raw = localStorage.getItem(VISITED_STATES_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return new Set();
    return new Set(list.filter(Boolean));
  } catch {
    return new Set();
  }
}

export function markVisitedState(stateSlug) {
  if (!stateSlug) return;
  try {
    const set = getVisitedStatesSet();
    set.add(stateSlug);
    localStorage.setItem(VISITED_STATES_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

export function clearVisitedStates() {
  try {
    localStorage.removeItem(VISITED_STATES_KEY);
  } catch {
    // ignore
  }
}

