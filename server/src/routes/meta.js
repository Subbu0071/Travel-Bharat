import express from "express";
import { store } from "../store/index.js";

export const metaRouter = express.Router();

metaRouter.get("/", async (_req, res, next) => {
  try {
    res.json(await store.getMeta());
  } catch (error) {
    next(error);
  }
});

metaRouter.get("/states", async (_req, res, next) => {
  try {
    const meta = await store.getMeta();
    res.json({ states: meta.states });
  } catch (error) {
    next(error);
  }
});

metaRouter.get("/cities", async (_req, res, next) => {
  try {
    const meta = await store.getMeta();
    res.json({ cities: meta.cities });
  } catch (error) {
    next(error);
  }
});

metaRouter.get("/categories", async (_req, res, next) => {
  try {
    const meta = await store.getMeta();
    res.json({ categories: meta.categories });
  } catch (error) {
    next(error);
  }
});
