import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./config/database.js";
import { authRouter } from "./routes/auth.js";
import { adminDestinationRouter, destinationRouter } from "./routes/destinations.js";
import { metaRouter } from "./routes/meta.js";
import { initializeStore } from "./store/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

process.env.JWT_SECRET ||= "travelbharat-dev-secret-change-before-deploy";
process.env.ADMIN_EMAIL ||= "admin@travelbharat.local";
process.env.ADMIN_PASSWORD ||= "TravelBharat@123";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any localhost / 127.0.0.1 origin (any port) for dev
      if (origin.startsWith("http://127.0.0.1") || origin.startsWith("http://localhost")) {
        return callback(null, true);
      }
      // Fallback to explicit CLIENT_ORIGIN env when provided
      const allowed = process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : [];
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: origin not allowed"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "TravelBharat API" });
});

app.use("/api/auth", authRouter);
app.use("/api/destinations", destinationRouter);
app.use("/api/admin/destinations", adminDestinationRouter);
app.use("/api/meta", metaRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || "Server error." });
});

const mongoEnabled = await connectDatabase(process.env.MONGO_URI);
await initializeStore({
  mongoEnabled,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD
});

app.listen(port, () => {
  console.log(`TravelBharat API running on http://127.0.0.1:${port}`);
  console.log(`Demo admin: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
});
