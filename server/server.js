import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";

async function start() {
  validateEnv();
  await connectDB();

  const PORT = process.env.PORT || 5000; // ✅ Render uses process.env.PORT

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
