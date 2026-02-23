import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  requestMentorship,
  respondMentorship,
  getMentorshipRequests,
} from "../controllers/mentorshipController.js";

const router = express.Router();

// Only students can request
router.post(
  "/request",
  protect,
  authorizeRoles("student"),
  requestMentorship
);

// Only alumni/admin can respond
router.put(
  "/respond/:id",
  protect,
  authorizeRoles("alumni", "admin"),
  respondMentorship
);

router.get(
  "/",
  protect,
  getMentorshipRequests
);

export default router;