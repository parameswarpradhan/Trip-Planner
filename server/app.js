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

// ✅ CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());


// ✅ Routes
app.use("/health", healthRoutes);
app.use("/api/trips", tripRoutes);

// ✅ Error middlewares MUST be at the end
app.use(notFound);
app.use(errorHandler);

export default app;
