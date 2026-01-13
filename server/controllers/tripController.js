import Trip from "../models/Trip.js";
import { generateTripPlan, regenerateSingleDay } from "../services/geminiService.js";
import { z } from "zod";
import { geocodePlace } from "../services/geocodeService.js";

const planSchema = z.object({
  destination: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().min(1000),
  tripStyle: z.enum(["budget", "mid", "luxury"]),
  interests: z.array(z.string()).optional(),
});

// ✅ concurrency limiter (prevents Nominatim 429)
async function geocodeWithLimit(items, destination, limit = 3) {
  const results = new Array(items.length);
  let i = 0;

  async function worker() {
    while (i < items.length) {
      const idx = i++;
      const item = items[idx];

      const coords = await geocodePlace({
        placeName: item.name,
        destination,
      });

      results[idx] = {
        ...item,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
      };
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);

  return results;
}

export async function planTrip(req, res, next) {
  try {
    const parsed = planSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.errors,
      });
    }

    const input = parsed.data;

    // ✅ Constraint: basic budget realism check
    const days =
      Math.max(
        1,
        Math.ceil(
          (new Date(input.endDate) - new Date(input.startDate)) / (1000 * 60 * 60 * 24)
        ) + 1
      );

    const dest = input.destination.toLowerCase();

    const expensiveCountries = [
      "usa",
      "united states",
      "uk",
      "united kingdom",
      "london",
      "japan",
      "tokyo",
      "europe",
      "paris",
      "germany",
      "france",
      "italy",
      "switzerland",
      "canada",
      "australia",
    ];
    const midCountries = [
      "thailand",
      "bali",
      "indonesia",
      "vietnam",
      "malaysia",
      "singapore",
      "dubai",
    ];

    let minPerDay = 1500;
    if (expensiveCountries.some((x) => dest.includes(x))) minPerDay = 9000;
    else if (midCountries.some((x) => dest.includes(x))) minPerDay = 3500;

    const minBudget = minPerDay * days;

    if (input.budget < minBudget) {
      return res.status(400).json({
        message: `Budget too low for ${input.destination}. Minimum recommended budget is ₹${minBudget.toLocaleString(
          "en-IN"
        )} for ${days} days.`,
      });
    }

    const itinerary = await generateTripPlan(input);

    // ✅ Extract AI places (raw)
    const rawPlaces = [];
    for (const day of itinerary.days || []) {
      for (const p of day.places || []) {
        rawPlaces.push({
          name: p.name,
          day: day.day,
          category: p.category || "sightseeing",
          source: "ai",
        });
      }
    }

    // ✅ Geocode places (lat/lng)
    const places = await geocodeWithLimit(rawPlaces, input.destination, 3);

    const trip = await Trip.create({
      destination: input.destination,
      startDate: input.startDate,
      endDate: input.endDate,
      budget: input.budget,
      tripStyle: input.tripStyle,
      interests: input.interests || [],
      itinerary,
      places,
    });

    return res.status(201).json({ tripId: trip._id });
  } catch (err) {
    const msg = (err?.message || "").toLowerCase();
    if (
      msg.includes("503") ||
      msg.includes("overloaded") ||
      msg.includes("service unavailable")
    ) {
      return res.status(503).json({
        message: "AI is currently overloaded. Please try again in a few seconds.",
      });
    }

    next(err);
  }
}

export async function getTrip(req, res, next) {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// ✅ regenerate a selected day only (+ geocode places for that day)
export async function regenerateDay(req, res, next) {
  try {
    const { tripId } = req.params;
    const { day } = req.body;

    const dayNumber = Number(day);
    if (!dayNumber || dayNumber < 1) {
      return res.status(400).json({ message: "Invalid day number" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const totalDays = trip.itinerary?.days?.length || 0;
    if (dayNumber > totalDays) {
      return res.status(400).json({ message: `Trip has only ${totalDays} days` });
    }

    const newDayPlan = await regenerateSingleDay({ trip, dayNumber });

    // ✅ Update only that day in itinerary
    const updatedDays = (trip.itinerary.days || []).map((d) =>
      d.day === dayNumber ? newDayPlan : d
    );
    trip.itinerary.days = updatedDays;

    // ✅ Remove previous places for that day
    const filteredPlaces = (trip.places || []).filter((p) => p.day !== dayNumber);

    // ✅ Build raw places from regenerated day
    const rawRegeneratedPlaces =
      (newDayPlan.places || []).map((p) => ({
        name: p.name,
        day: dayNumber,
        category: p.category || "sightseeing",
        source: "ai",
      })) || [];

    // ✅ Geocode regenerated day places
    const geocodedRegeneratedPlaces = await geocodeWithLimit(
      rawRegeneratedPlaces,
      trip.destination,
      3
    );

    trip.places = [...filteredPlaces, ...geocodedRegeneratedPlaces];

    await trip.save();

    res.json({
      message: `Day ${dayNumber} regenerated successfully`,
      updatedDay: newDayPlan,
    });
  } catch (err) {
    const msg = (err?.message || "").toLowerCase();
    if (
      msg.includes("503") ||
      msg.includes("overloaded") ||
      msg.includes("service unavailable")
    ) {
      return res.status(503).json({
        message: "AI is overloaded. Try again in a few seconds.",
      });
    }

    next(err);
  }
}

export async function addCustomPlace(req, res, next) {
  try {
    const { tripId } = req.params;
    const { name, day, category, lat, lng } = req.body;

    if (!name || !day || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "Missing place details" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    trip.places.push({
      name,
      day: Number(day),
      category: category || "custom",
      lat: Number(lat),
      lng: Number(lng),
      source: "user",
    });

    await trip.save();

    res.status(201).json({ message: "Place added", places: trip.places });
  } catch (err) {
    next(err);
  }
}
