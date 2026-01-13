import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true, message: "TripWise API running" });
});

export default router;
