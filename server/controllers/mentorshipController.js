import Mentorship from "../models/Mentorship.js";
import { getIO } from "../socket/socket.js";
import Notification from "../models/Notification.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

// Student sends request
export const requestMentorship = async (req, res) => {
  try {
    const { alumniId, message } = req.body;

    if (!alumniId || !message) {
      return res.status(400).json({
        message: "Alumni ID and message are required",
      });
    }

    //  CHECK BLOCK STATUS
    const alumniUser = await User.findById(alumniId);

    if (!alumniUser) {
      return res.status(404).json({
        message: "Alumni not found",
      });
    }

    // If alumni has blocked this student
    if (alumniUser.blockedUsers.includes(req.user._id)) {
      return res.status(403).json({
        message: "You are blocked by this user",
      });
    }

    // Prevent duplicate pending request
    const existing = await Mentorship.findOne({
      student: req.user._id,
      alumni: alumniId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a pending request",
      });
    }

    const mentorship = await Mentorship.create({
      student: req.user._id,
      alumni: alumniId,
      message,
    });

    res.status(201).json(mentorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alumni responds
export const respondMentorship = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const mentorship = await Mentorship.findById(id);

    if (!mentorship) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // Only assigned alumni can respond
    if (mentorship.alumni.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    mentorship.status = status;
    await mentorship.save();

    if (status === "accepted") {
      await Conversation.create({
        participants: [mentorship.student, mentorship.alumni],
        mentorship: mentorship._id,
      });
    }

    await Notification.create({
      recipient: mentorship.student,
      type: "mentorship_response",
      message: `Your mentorship request was ${status}`,
      relatedId: mentorship._id,
    });

    // Notifying student in real-time
    const io = getIO();

    const unreadCount = await Notification.countDocuments({
      recipient: mentorship.student,
      isRead: false,
    });

    io.to(mentorship.student.toString()).emit(
      "unreadNotificationCount",
      unreadCount,
    );

    io.to(mentorship.student.toString()).emit("mentorshipResponse", {
      message: `Your mentorship request was ${status}`,
      mentorshipId: mentorship._id,
    });

    const populatedMentorship = await mentorship.populate([
      { path: "student", select: "username email" },
      { path: "alumni", select: "username email" },
    ]);

    res.json(populatedMentorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMentorshipRequests = async (req, res) => {
  try {
    let mentorships;

    if (req.user.role === "alumni") {
      // Alumni sees requests sent to them
      mentorships = await Mentorship.find({
        alumni: req.user._id,
        status: "pending",
      }).populate("student", "username email");
    } else {
      // Student sees requests they sent
      mentorships = await Mentorship.find({
        student: req.user._id,
      }).populate("alumni", "username email status");
    }

    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
