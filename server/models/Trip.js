import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    day: { type: Number, required: true },
    category: { type: String, default: "sightseeing" },
    lat: { type: Number },
    lng: { type: Number },
    source: { type: String, enum: ["ai", "user"], default: "ai" }
  },
  { _id: false }
);

const TripSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    tripStyle: { type: String, enum: ["budget", "mid", "luxury"], required: true },
    interests: { type: [String], default: [] },

    itinerary: { type: Object, required: true },
    places: { type: [PlaceSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Trip", TripSchema);
