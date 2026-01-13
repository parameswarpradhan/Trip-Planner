import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // This uses the REST listModels behind the scenes in SDK (limited)
  // But easiest: just test common model names via generateContent.
  const candidates = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro",
    "models/gemini-pro",
  ];

  for (const name of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: name });
      const res = await model.generateContent("Say OK");
      console.log("✅ Works:", name, "=>", res.response.text().slice(0, 30));
    } catch (e) {
      console.log("❌ Fails:", name, "=>", e.message.split("\n")[0]);
    }
  }
}

main();
