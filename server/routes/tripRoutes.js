import { Router } from "express";
import { planTrip, getTrip, regenerateDay } from "../controllers/tripController.js";
import { aiRateLimiter } from "../middlewares/rateLimitMiddleware.js";
import {addCustomPlace } from "../controllers/tripController.js";

const router = Router();

router.post("/plan", aiRateLimiter, planTrip);
router.get("/:tripId", getTrip);

// ✅ NEW: regenerate only one day
router.post("/:tripId/regenerate-day", aiRateLimiter, regenerateDay);
router.post("/:tripId/add-place", addCustomPlace);


export default router;
