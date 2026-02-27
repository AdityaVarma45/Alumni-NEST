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

/* ===============================
   USERS LIST
=============================== */
router.get("/", protect, getAllUsers);

/* ===============================
   CURRENT USER PROFILE
=============================== */
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

/* ===============================
   PROFILE SETUP
=============================== */
router.put("/profile/setup", protect, setupProfile);

/* ===============================
   RECOMMENDED ALUMNI
=============================== */
router.get("/recommended", protect, getRecommendedAlumni);

/* ===============================
   BLOCK / UNBLOCK
=============================== */
router.post("/block", protect, blockUser);
router.get("/blocked", protect, getBlockedUsers);
router.post("/unblock", protect, unblockUser);

/* ===============================
   SINGLE USER PROFILE
   (KEEP THIS LAST)
=============================== */
router.get("/:id", protect, getUserProfile);

export default router;