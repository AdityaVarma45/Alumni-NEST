import Notification from "../models/Notification.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";

export const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  relatedId = null,
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    message,
    relatedId,
  });

  const receiverSocketId = getReceiverSocketId(recipient.toString());

  if (receiverSocketId) {
    getIO().to(receiverSocketId).emit("newNotification", {
      _id: notification._id,
      message,
      type,
      sender,
      read: false,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};