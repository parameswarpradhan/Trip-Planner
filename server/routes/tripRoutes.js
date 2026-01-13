import express from "express";
import {
  planTrip,
  getTrip,
  regenerateDay,
  addCustomPlace,
} from "../controllers/tripController.js";

const router = express.Router();

// ✅ IMPORTANT: static routes first
router.post("/plan", planTrip);

// optional features
router.post("/:tripId/regenerate-day", regenerateDay);
router.post("/:tripId/add-place", addCustomPlace);

// ✅ dynamic route LAST
router.get("/:tripId", getTrip);

export default router;
