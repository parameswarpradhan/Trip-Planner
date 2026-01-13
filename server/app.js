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
  process.env.CLIENT_URL, // your Vercel URL
  "http://localhost:5173",
].filter(Boolean);

console.log("✅ Allowed origins:", allowedOrigins);

// ✅ IMPORTANT: apply CORS globally, including error responses
app.use(
  cors({
    origin: (origin, cb) => {
      // allow curl/postman (no origin)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error("CORS blocked for origin: " + origin), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);



// ✅ Preflight
app.options(/.*/, cors());

// ✅ Routes
app.use("/health", healthRoutes);
app.use("/api/trips", tripRoutes);

// ✅ Errors last
app.use(notFound);
app.use(errorHandler);

export default app;
