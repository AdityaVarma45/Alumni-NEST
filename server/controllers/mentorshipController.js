import Mentorship from "../models/Mentorship.js";
import { getIO } from "../socket/socket.js";
import Notification from "../models/Notification.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

/*
  Student sends mentorship request
*/
export const requestMentorship = async (req, res) => {
  try {
    const { alumniId, message } = req.body;

    if (!alumniId || !message) {
      return res.status(400).json({
        message: "Alumni ID and message are required",
      });
    }

    const alumniUser = await User.findById(alumniId);

    if (!alumniUser) {
      return res.status(404).json({
        message: "Alumni not found",
      });
    }

    if (alumniUser.blockedUsers.includes(req.user._id)) {
      return res.status(403).json({
        message: "You are blocked by this user",
      });
    }

    const existing = await Mentorship.findOne({
      student: req.user._id,
      alumni: alumniId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "Mentorship already exists",
        mentorship: existing,
      });
    }

    const mentorship = await Mentorship.create({
      student: req.user._id,
      alumni: alumniId,
      message,
      status: "pending",
    });

    // ---------- LIVE COUNT UPDATE ----------
    const io = getIO();

    const pendingCount = await Mentorship.countDocuments({
      alumni: alumniId,
      status: "pending",
    });

    io.to(alumniId.toString()).emit(
      "mentorshipRequestCount",
      pendingCount
    );

    res.status(201).json(mentorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Alumni responds to request
*/
export const respondMentorship = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const mentorship = await Mentorship.findById(id);

    if (!mentorship) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (mentorship.alumni.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    mentorship.status = status;
    await mentorship.save();

    // create conversation once
    let conversation = null;

    if (status === "accepted") {
      conversation = await Conversation.findOne({
        participants: {
          $all: [mentorship.student, mentorship.alumni],
        },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [mentorship.student, mentorship.alumni],
          mentorship: mentorship._id,
        });
      }
    }

    await Notification.create({
      recipient: mentorship.student,
      type: "mentorship_response",
      message: `Your mentorship request was ${status}`,
      relatedId: mentorship._id,
    });

    const io = getIO();

    // LIVE STATUS EVENT
    io.to(mentorship.student.toString()).emit(
      "mentorshipStatusUpdated",
      {
        mentorshipId: mentorship._id,
        alumniId: mentorship.alumni.toString(),
        status,
        conversationId: conversation?._id || null,
      }
    );

    const populated = await mentorship.populate([
      { path: "student", select: "username email" },
      { path: "alumni", select: "username email" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Get mentorship requests
*/
export const getMentorshipRequests = async (req, res) => {
  try {
    let mentorships;

    if (req.user.role === "alumni") {
      mentorships = await Mentorship.find({
        alumni: req.user._id,
      })
        .populate("student", "username email")
        .sort({ createdAt: -1 });
    } else {
      mentorships = await Mentorship.find({
        student: req.user._id,
      })
        .populate("alumni", "username email")
        .sort({ createdAt: -1 });
    }

    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};