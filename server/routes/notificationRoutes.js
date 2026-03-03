import express from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Get all notifications */
router.get("/", protect, getNotifications);

/* Mark single notification read */
router.put("/:id/read", protect, markNotificationRead);

/* Mark all notifications read */
router.put("/read-all", protect, markAllRead);

export default router;