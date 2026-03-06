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

/*
========================================
Student sends mentorship request
========================================
*/
router.post(
  "/request",
  protect,
  authorizeRoles("student"),
  requestMentorship
);

/*
========================================
Alumni offers mentorship to student
========================================
*/
router.post(
  "/offer",
  protect,
  authorizeRoles("alumni"),
  offerMentorship
);

/*
========================================
Respond to mentorship
(student OR alumni depending on initiator)
========================================
*/
router.put(
  "/respond/:id",
  protect,
  authorizeRoles("student", "alumni", "admin"),
  respondMentorship
);

/*
========================================
Get mentorships
========================================
*/
router.get(
  "/",
  protect,
  getMentorshipRequests
);

export default router;