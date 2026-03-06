import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  requestMentorship,
  respondMentorship,
  getMentorshipRequests,
  offerMentorship,
} from "../controllers/mentorshipController.js";

const router = express.Router();

router.post(
  "/request",
  protect,
  authorizeRoles("student"),
  requestMentorship
);

router.post(
  "/offer",
  protect,
  authorizeRoles("alumni"),
  offerMentorship
);

router.put(
  "/respond/:id",
  protect,
  authorizeRoles("alumni", "admin"),
  respondMentorship
);

router.get("/", protect, getMentorshipRequests);

export default router;