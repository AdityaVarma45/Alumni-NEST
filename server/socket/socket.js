import { Server } from "socket.io";
import Message from "../models/Message.js";
import User from "../models/User.js";

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* ==============================
       USER ONLINE
    ============================== */
    socket.on("userOnline", async (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      socket.join(userId.toString());

      // Mark undelivered messages TO this user as delivered
      await Message.updateMany(
        {
          conversation: { $exists: true },
          sender: { $ne: userId },
          isDelivered: false,
        },
        { isDelivered: true }
      );

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    /* ==============================
       JOIN CONVERSATION ROOM
    ============================== */
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId.toString());
    });

    /* ==============================
       TYPING INDICATOR
    ============================== */
    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(conversationId.toString()).emit("userTyping", {
        conversationId,
        userId,
      });
    });

    socket.on("stopTyping", ({ conversationId, userId }) => {
      socket.to(conversationId.toString()).emit("userStoppedTyping", {
        conversationId,
        userId,
      });
    });

    /* ==============================
       MESSAGE READ LIVE UPDATE
    ============================== */
    socket.on("messagesRead", ({ conversationId, readerId }) => {
      socket
        .to(conversationId.toString())
        .emit("messagesReadUpdate", {
          conversationId,
          readerId,
        });
    });

    /* ==============================
       DISCONNECT
    ============================== */
    socket.on("disconnect", async () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          await User.findByIdAndUpdate(userId, {
            lastSeen: new Date(),
          });

          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("User disconnected:", socket.id);
    });
  });
};

/* ==============================
   HELPERS
============================== */

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};
