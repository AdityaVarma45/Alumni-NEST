import Notification from "../models/Notification.js";
import { getIO } from "../socket/socket.js";

export const createNotification = async ({
  recipient,
  sender = null,
  type,
  message,
  relatedId = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      relatedId,
    });

    // 🔔 Emit real-time notification
    const io = getIO();
    io.to(recipient.toString()).emit(
      "newNotification",
      notification
    );

    return notification;
  } catch (error) {
    console.error("Notification Error:", error);
  }
};