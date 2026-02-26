import { Server } from "socket.io";
import Message from "../models/Message.js";
import User from "../models/User.js";

let io;

/*
  userId -> Set of socketIds
  supports multiple tabs/devices
*/
const onlineUsers = new Map();

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
      const id = userId.toString();

      // create set if not exists
      if (!onlineUsers.has(id)) {
        onlineUsers.set(id, new Set());
      }

      // add this socket
      onlineUsers.get(id).add(socket.id);

      socket.join(id);

      // mark messages delivered
      await Message.updateMany(
        {
          conversation: { $exists: true },
          sender: { $ne: userId },
          isDelivered: false,
        },
        { isDelivered: true }
      );

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("ONLINE USERS:", Array.from(onlineUsers.keys()));
    });

    /* ==============================
       JOIN CONVERSATION
    ============================== */
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId.toString());
    });

    /* ==============================
       TYPING
    ============================== */
    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("userTyping", {
        conversationId,
        userId,
      });
    });

    socket.on("stopTyping", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("userStoppedTyping", {
        conversationId,
        userId,
      });
    });

    /* ==============================
       READ STATUS
    ============================== */
    socket.on("messagesRead", ({ conversationId, readerId }) => {
      socket.to(conversationId).emit("messagesReadUpdate", {
        conversationId,
        readerId,
      });
    });

    /* ==============================
       DISCONNECT
    ============================== */
    socket.on("disconnect", async () => {
      for (const [userId, sockets] of onlineUsers.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);

          // only remove user when NO tabs left
          if (sockets.size === 0) {
            onlineUsers.delete(userId);

            await User.findByIdAndUpdate(userId, {
              lastSeen: new Date(),
            });
          }

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
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};