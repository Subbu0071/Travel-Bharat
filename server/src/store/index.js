import {
  createMemoryDestination,
  deleteMemoryDestination,
  findMemoryAdmin,
  getMemoryDestination,
  getMemoryMeta,
  listMemoryDestinations,
  seedMemoryAdmin,
  updateMemoryDestination
} from "./memoryStore.js";
import {
  createMongoDestination,
  deleteMongoDestination,
  findMongoAdmin,
  getMongoDestination,
  getMongoMeta,
  listMongoDestinations,
  seedMongo,
  updateMongoDestination
} from "./mongoStore.js";

let usingMongo = false;

export async function initializeStore({ mongoEnabled, adminEmail, adminPassword }) {
  usingMongo = mongoEnabled;
  if (usingMongo) {
    await seedMongo({ email: adminEmail, password: adminPassword });
    return;
  }

  await seedMemoryAdmin({ email: adminEmail, password: adminPassword });
}

export const store = {
  findAdmin(email) {
    return usingMongo ? findMongoAdmin(email) : findMemoryAdmin(email);
  },
  listDestinations(filters) {
    return usingMongo ? listMongoDestinations(filters) : listMemoryDestinations(filters);
  },
  getDestination(slug) {
    return usingMongo ? getMongoDestination(slug) : getMemoryDestination(slug);
  },
  createDestination(payload) {
    return usingMongo ? createMongoDestination(payload) : createMemoryDestination(payload);
  },
  updateDestination(slug, payload) {
    return usingMongo ? updateMongoDestination(slug, payload) : updateMemoryDestination(slug, payload);
  },
  deleteDestination(slug) {
    return usingMongo ? deleteMongoDestination(slug) : deleteMemoryDestination(slug);
  },
  getMeta() {
    return usingMongo ? getMongoMeta() : getMemoryMeta();
  }
};
