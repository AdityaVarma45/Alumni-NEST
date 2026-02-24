import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getRecommendedAlumni } from "../controllers/userController.js";
import { updateProfileSetup } from "../controllers/userController.js";

import {
  getAllUsers,
  blockUser,
  getSkillMatches, // 👑 NEW — skill intelligence controller
} from "../controllers/userController.js";

const router = express.Router();

/* ===================================================
   BASIC USER ROUTES
=================================================== */

// get all users (used in browse users page)
router.get("/", protect, getAllUsers);

// logged-in user profile
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// block a user
router.post("/block", protect, blockUser);

/* ===================================================
   👑 SKILL MATCH INTELLIGENCE ROUTE
   returns best alumni matches based on skills
=================================================== */

router.get("/matches", protect, getSkillMatches);
router.get("/recommended", protect, getRecommendedAlumni);
router.put("/profile/setup", protect, updateProfileSetup);

export default router;