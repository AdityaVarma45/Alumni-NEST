import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { getIO, isUserOnline } from "../socket/socket.js";
import User from "../models/User.js";

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // find receiver
    const receiverId = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    if (!receiverId) {
      return res.status(400).json({
        message: "Invalid conversation",
      });
    }

    const senderUser = await User.findById(req.user._id);
    const receiverUser = await User.findById(receiverId);

    if (!receiverUser) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    // receiver blocked sender
    if (
      receiverUser.blockedUsers.some(
        (id) => id.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({
        message: "You are blocked by this user",
      });
    }

    // sender blocked receiver
    if (
      senderUser.blockedUsers.some(
        (id) => id.toString() === receiverId.toString()
      )
    ) {
      return res.status(403).json({
        message: "You blocked this user",
      });
    }

    const delivered = isUserOnline(receiverId);

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content,
      isDelivered: delivered,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    const io = getIO();

    io.to(conversationId.toString()).emit("receiveMessage", message);

    io.to(conversationId.toString()).emit("conversationUpdated", {
      conversationId,
      message,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET USER CONVERSATIONS */
export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username email role lastSeen")
      .sort({ updatedAt: -1 });

    const conversationsWithMeta = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          sender: { $ne: req.user._id },
          isRead: false,
        });

        const otherParticipant = conversation.participants.find(
          (p) => p._id.toString() !== req.user._id.toString()
        );

        const online = isUserOnline(otherParticipant._id);

        return {
          ...conversation.toObject(),
          unreadCount,
          online,
          lastSeen: otherParticipant.lastSeen,
        };
      })
    );

    res.json(conversationsWithMeta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET MESSAGES */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversation: conversationId,
      deletedFor: { $nin: [req.user._id] },
    })
      .populate("sender", "username")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* MARK READ */
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      { isRead: true }
    );

    const io = getIO();

    io.to(conversationId.toString()).emit("messagesRead", {
      conversationId,
      readerId: req.user._id,
    });

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE MESSAGE */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (deleteForEveryone) {
      const timeLimit = 5 * 60 * 1000;

      if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Only sender can delete for everyone",
        });
      }

      if (Date.now() - message.createdAt.getTime() > timeLimit) {
        return res.status(400).json({
          message: "Delete time window expired",
        });
      }

      message.isDeletedForEveryone = true;
      message.content = "This message was deleted";
      await message.save();

      getIO()
        .to(message.conversation.toString())
        .emit("messageDeletedForEveryone", { messageId });

      return res.json({ message: "Deleted for everyone" });
    }

    if (!message.deletedFor.includes(req.user._id)) {
      message.deletedFor.push(req.user._id);
      await message.save();
    }

    res.json({ message: "Deleted for you" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};