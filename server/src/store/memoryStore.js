import bcrypt from "bcryptjs";
import { seedDestinations } from "../data/seedDestinations.js";
import { toSlug } from "../utils/slug.js";

let destinations = seedDestinations.map((item) => ({ ...item, id: item.slug }));
let admin = null;

export async function seedMemoryAdmin({ email, password }) {
  admin = {
    id: "admin",
    email: email.toLowerCase(),
    name: "TravelBharat Admin",
    passwordHash: await bcrypt.hash(password, 10)
  };
}

export function findMemoryAdmin(email) {
  if (!admin || admin.email !== email.toLowerCase()) return null;
  return admin;
}

export function listMemoryDestinations(filters = {}) {
  const search = filters.search?.trim().toLowerCase();
  return destinations.filter((place) => {
    const haystack = [place.name, place.state, place.city, place.category, place.description].join(" ").toLowerCase();
    return (
      (!search || haystack.includes(search)) &&
      (!filters.state || place.stateSlug === filters.state || place.state === filters.state) &&
      (!filters.city || place.citySlug === filters.city || place.city === filters.city) &&
      (!filters.category || place.category === filters.category)
    );
  });
}

export function getMemoryDestination(slug) {
  return destinations.find((place) => place.slug === slug);
}

export function createMemoryDestination(payload) {
  const baseSlug = toSlug(payload.name);
  let slug = baseSlug;
  let suffix = 2;
  while (destinations.some((item) => item.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const place = normalizeDestination({ ...payload, slug });
  destinations = [place, ...destinations];
  return place;
}

export function updateMemoryDestination(slug, payload) {
  const index = destinations.findIndex((item) => item.slug === slug);
  if (index === -1) return null;

  const next = normalizeDestination({ ...destinations[index], ...payload, slug });
  destinations[index] = next;
  return next;
}

export function deleteMemoryDestination(slug) {
  const before = destinations.length;
  destinations = destinations.filter((item) => item.slug !== slug);
  return destinations.length !== before;
}

export function getMemoryMeta() {
  const states = new Map();
  const cities = new Map();
  const categories = new Set();

  destinations.forEach((place) => {
    categories.add(place.category);
    states.set(place.stateSlug, {
      name: place.state,
      slug: place.stateSlug,
      count: (states.get(place.stateSlug)?.count || 0) + 1
    });
    cities.set(place.citySlug, {
      name: place.city,
      slug: place.citySlug,
      state: place.state,
      stateSlug: place.stateSlug,
      count: (cities.get(place.citySlug)?.count || 0) + 1
    });
  });

  return {
    states: [...states.values()].sort((a, b) => a.name.localeCompare(b.name)),
    cities: [...cities.values()].sort((a, b) => a.name.localeCompare(b.name)),
    categories: [...categories].sort()
  };
}

function normalizeDestination(payload) {
  const stateSlug = payload.stateSlug || toSlug(payload.state);
  const citySlug = payload.citySlug || toSlug(payload.city);
  return {
    id: payload.slug,
    name: payload.name.trim(),
    slug: payload.slug,
    state: payload.state.trim(),
    stateSlug,
    city: payload.city.trim(),
    citySlug,
    category: payload.category,
    description: payload.description.trim(),
    bestTime: payload.bestTime.trim(),
    fees: payload.fees.trim(),
    map: payload.map.trim(),
    images: Array.isArray(payload.images) ? payload.images.filter(Boolean) : [payload.image].filter(Boolean),
    nearby: Array.isArray(payload.nearby)
      ? payload.nearby.filter(Boolean)
      : String(payload.nearby || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    verified: Boolean(payload.verified),
    featured: Boolean(payload.featured)
  };
}
