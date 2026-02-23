import express from "express";
import protect from "../middleware/authMiddleware.js";
import {getNotifications} from "../controllers/notificationController.js";
import {markAsRead} from "../controllers/notificationController.js";
import {getUnreadCount} from "../controllers/notificationController.js";


const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.get("/unread-count", protect, getUnreadCount);


export default router;
