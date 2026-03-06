import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getRecommendedAlumni,
  getRecommendedStudents,
} from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/alumni", protect, getRecommendedAlumni);

router.get("/students", protect, getRecommendedStudents);

export default router;