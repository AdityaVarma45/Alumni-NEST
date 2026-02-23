import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getUserConversations,
  getMessages,
  markMessagesAsRead,
  deleteMessage,
} from "../controllers/chatController.js";

const router = express.Router();

// Get all conversations of logged-in user
router.get("/conversations", protect, getUserConversations);

// Get messages of a specific conversation
router.get(
  "/conversations/:conversationId/messages",
  protect,
  getMessages
);

// Send message to a conversation
router.post(
  "/conversations/:conversationId/messages",
  protect,
  sendMessage
);

// Mark messages as read
router.put(
  "/conversations/:conversationId/read",
  protect,
  markMessagesAsRead
);

// Delete message
router.delete(
  "/messages/:messageId",
  protect,
  deleteMessage
);

export default router;
