import Notification from "../models/Notification.js";
import { getIO } from "../socket/socket.js";

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

  // emit to user room (works for multi-tab)
  const io = getIO();
  io.to(recipient.toString()).emit("newNotification", notification);

  return notification;
};