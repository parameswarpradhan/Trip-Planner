import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import tripRoutes from "./routes/tripRoutes.js";
import healthRoutes from "./routes/health.js";

import { notFound } from "./middlewares/notFoundMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// ✅ Allow Vercel + Localhost
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://trip-planner-vert.vercel.app"
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ MUST allow preflight




// ✅ Routes
app.use("/health", healthRoutes);
app.use("/api/trips", tripRoutes);

// ✅ Errors last
app.use(notFound);
app.use(errorHandler);

export default app;
