import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { Destination } from "../models/Destination.js";
import { seedDestinations } from "../data/seedDestinations.js";
import { toSlug } from "../utils/slug.js";

export async function seedMongo({ email, password }) {
  // Ensure each seed destination exists in the DB. Use upsert so partial previous
  // insertions or unique-index conflicts won't prevent completing the seed.
  const ops = seedDestinations.map((item) => ({
    updateOne: {
      filter: { slug: item.slug },
      update: { $setOnInsert: normalizeDestination(item) },
      upsert: true
    }
  }));

  if (ops.length > 0) {
    await Destination.bulkWrite(ops, { ordered: false });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    await Admin.create({
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      name: "TravelBharat Admin"
    });
  }
}

export function findMongoAdmin(email) {
  return Admin.findOne({ email: email.toLowerCase() }).lean();
}

export async function listMongoDestinations(filters = {}) {
  const query = {};
  // Uses MongoDB's built-in text index (see Destination schema index())
  // $text: { $search } performs plain keyword search.
  if (filters.search) query.$text = { $search: filters.search };
  if (filters.state) query.stateSlug = filters.state;
  if (filters.city) query.citySlug = filters.city;
  if (filters.category) query.category = filters.category;

  return Destination.find(query).sort({ featured: -1, name: 1 }).lean();
}

export function getMongoDestination(slug) {
  return Destination.findOne({ slug }).lean();
}

export async function createMongoDestination(payload) {
  const slug = await createUniqueSlug(payload.name);
  return Destination.create(normalizeDestination({ ...payload, slug }));
}

export async function updateMongoDestination(slug, payload) {
  return Destination.findOneAndUpdate({ slug }, normalizeDestination({ ...payload, slug }), {
    new: true,
    runValidators: true
  }).lean();
}

export async function deleteMongoDestination(slug) {
  const result = await Destination.deleteOne({ slug });
  return result.deletedCount > 0;
}

export async function getMongoMeta() {
  const records = await Destination.find({}, "state stateSlug city citySlug category").lean();
  const states = new Map();
  const cities = new Map();
  const categories = new Set();

  records.forEach((place) => {
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

async function createUniqueSlug(name) {
  const baseSlug = toSlug(name);
  let slug = baseSlug;
  let suffix = 2;
  while (await Destination.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

function normalizeDestination(payload) {
  return {
    name: payload.name?.trim(),
    slug: payload.slug,
    state: payload.state?.trim(),
    stateSlug: toSlug(payload.state),
    city: payload.city?.trim(),
    citySlug: toSlug(payload.city),
    category: payload.category,
    description: payload.description?.trim(),
    bestTime: payload.bestTime?.trim(),
    fees: payload.fees?.trim(),
    map: payload.map?.trim(),
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
