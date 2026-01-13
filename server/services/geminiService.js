import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isOverloadedError(err) {
  const msg = (err?.message || "").toLowerCase();
  return msg.includes("503") || msg.includes("overloaded") || msg.includes("service unavailable");
}

async function callGemini(modelName, prompt) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text);
}

export async function generateTripPlan(input) {
  const { destination, startDate, endDate, budget, tripStyle, interests } = input;

  const prompt = `
Return ONLY valid JSON. No markdown. No explanation.

Schema:
{
  "title": string,
  "overview": string,
  "budgetBreakdown": { "stay": number, "food": number, "transport": number, "activities": number },
  "transportTips": string[],
  "days": [
    {
      "day": number,
      "theme": string,
      "morning": string[],
      "afternoon": string[],
      "evening": string[],
      "places": [{ "name": string, "category": "sightseeing"|"food"|"shopping"|"adventure" }]
    }
  ]
}

Trip:
Destination: ${destination}
Dates: ${startDate} to ${endDate}
Budget: ${budget}
Style: ${tripStyle}
Interests: ${(interests || []).join(", ") || "general"}

Rules:
- realistic plan
- not overloaded
- real places only
- budgetBreakdown should roughly match total budget
`;

  const models = [
    "models/gemini-2.5-flash",
    "models/gemini-2.5-flash-lite",
    "models/gemini-flash-lite-latest",
    "models/gemini-2.0-flash",
    "models/gemini-2.0-flash-lite",
  ];

  let lastErr = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await callGemini(modelName, prompt);
      } catch (err) {
        lastErr = err;
        if (isOverloadedError(err)) {
          await sleep(600 * attempt);
          continue;
        }
        break;
      }
    }
  }

  throw lastErr;
}

// ✅ NEW: regenerate ONLY one day
export async function regenerateSingleDay({ trip, dayNumber }) {
  const itinerary = trip.itinerary;

  const existingDay = itinerary?.days?.find((d) => d.day === dayNumber) || {};

  const prompt = `
Return ONLY valid JSON. No markdown.

Rewrite ONLY Day ${dayNumber} itinerary (do not return full itinerary).

Day object schema:
{
  "day": number,
  "theme": string,
  "morning": string[],
  "afternoon": string[],
  "evening": string[],
  "places": [{ "name": string, "category": "sightseeing"|"food"|"shopping"|"adventure" }]
}

Trip details:
Destination: ${trip.destination}
Budget: ${trip.budget}
Trip Style: ${trip.tripStyle}
Interests: ${(trip.interests || []).join(", ") || "general"}

Existing Day ${dayNumber} (reference):
${JSON.stringify(existingDay, null, 2)}

Rules:
- realistic, not overloaded
- must contain real places
- output ONLY the day object as JSON
`;

  const models = [
    "models/gemini-2.5-flash",
    "models/gemini-2.5-flash-lite",
    "models/gemini-flash-lite-latest",
    "models/gemini-2.0-flash",
    "models/gemini-2.0-flash-lite",
  ];

  let lastErr = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await callGemini(modelName, prompt);
      } catch (err) {
        lastErr = err;
        if (isOverloadedError(err)) {
          await sleep(600 * attempt);
          continue;
        }
        break;
      }
    }
  }

  throw lastErr;
}
