import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  blockUser,
  setupProfile,
  getUserProfile,
  getRecommendedAlumni,
  getBlockedUsers,
  unblockUser,
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

/* get specific user profile */
router.get("/:id", protect, getUserProfile);

// blocked users routes
router.get("/blocked", protect, getBlockedUsers);
router.post("/unblock", protect, unblockUser);

export default router;