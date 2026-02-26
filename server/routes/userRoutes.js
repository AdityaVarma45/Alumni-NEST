import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  blockUser,
  setupProfile,
  getRecommendedAlumni,
} from "../controllers/userController.js";

const router = express.Router();

/* users list */
router.get("/", protect, getAllUsers);

/* current user profile */
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

/* profile setup */
router.put("/profile/setup", protect, setupProfile);

/* recommended alumni (NEW) */
router.get("/recommended", protect, getRecommendedAlumni);

/* block user */
router.post("/block", protect, blockUser);

export default router;