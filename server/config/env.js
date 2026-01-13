import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: process.env.MONGO_URI,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

export function validateEnv() {
  if (!env.MONGO_URI) throw new Error("Missing environment variable: MONGO_URI");
  if (!env.GEMINI_API_KEY) throw new Error("Missing environment variable: GEMINI_API_KEY");
  if (!env.CLIENT_URL) throw new Error("Missing environment variable: CLIENT_URL");
}
