import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { store } from "../store/index.js";

export const destinationRouter = express.Router();
export const adminDestinationRouter = express.Router();

destinationRouter.get("/", async (req, res, next) => {
  try {
    const destinations = await store.listDestinations(req.query);
    res.json({ destinations });
  } catch (error) {
    next(error);
  }
});

destinationRouter.get("/:slug", async (req, res, next) => {
  try {
    const destination = await store.getDestination(req.params.slug);
    if (!destination) return res.status(404).json({ message: "Destination not found." });
    return res.json({ destination });
  } catch (error) {
    return next(error);
  }
});

adminDestinationRouter.use(requireAdmin);

adminDestinationRouter.post("/", async (req, res, next) => {
  try {
    const error = validateDestination(req.body);
    if (error) return res.status(400).json({ message: error });

    const destination = await store.createDestination(req.body);
    return res.status(201).json({ destination });
  } catch (error) {
    return next(error);
  }
});

adminDestinationRouter.put("/:slug", async (req, res, next) => {
  try {
    const error = validateDestination(req.body);
    if (error) return res.status(400).json({ message: error });

    const destination = await store.updateDestination(req.params.slug, req.body);
    if (!destination) return res.status(404).json({ message: "Destination not found." });
    return res.json({ destination });
  } catch (error) {
    return next(error);
  }
});

adminDestinationRouter.delete("/:slug", async (req, res, next) => {
  try {
    const deleted = await store.deleteDestination(req.params.slug);
    if (!deleted) return res.status(404).json({ message: "Destination not found." });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

function validateDestination(payload) {
  const required = ["name", "state", "city", "category", "description", "bestTime", "fees", "map"];
  const missing = required.find((field) => !payload[field]);
  if (missing) return `${missing} is required.`;

  const allowedCategories = ["Heritage", "Nature", "Adventure", "Religious"];
  if (payload.category && !allowedCategories.includes(payload.category)) {
    return "category must be one of: Heritage, Nature, Adventure, Religious.";
  }

  if (!Array.isArray(payload.images) || payload.images.length === 0) return "At least one image URL is required.";

  // nearby is optional in UI, but backend models expect array<string>
  if (typeof payload.nearby === "undefined" || payload.nearby === null) payload.nearby = [];
  if (!Array.isArray(payload.nearby)) return "nearby must be an array of attraction strings.";

  return null;
}

