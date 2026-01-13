import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env, validateEnv } from "./config/env.js";
console.log("DEBUG ENV:", process.env.MONGO_URI, process.env.GEMINI_API_KEY, process.env.CLIENT_URL);


async function start() {
  validateEnv();
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`✅ Server running:    ${env.PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
