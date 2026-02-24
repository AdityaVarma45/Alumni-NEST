import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getRecommendedAlumni } from "../controllers/recommendationController.js";

/*
  Recommendation Routes
  ---------------------
  Protected route → only logged-in users
*/

const router = express.Router();

/*
  GET /api/recommendations/alumni
  returns smart ranked alumni list
*/
router.get("/alumni", protect, getRecommendedAlumni);

export default router;