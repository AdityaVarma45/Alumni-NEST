import Mentorship from "../models/Mentorship.js";
import { getIO } from "../socket/socket.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

/*
====================================================
Student sends mentorship request
====================================================
*/
export const requestMentorship = async (req, res) => {
  try {
    const { alumniId, message } = req.body;

    const alumni = await User.findById(alumniId);

    if (!alumni) {
      return res.status(404).json({
        message: "Alumni not found",
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
      });
    }

    const mentorship = await Mentorship.create({
      student: req.user._id,
      alumni: alumniId,
      message,
      initiatedBy: "student",
      status: "pending",
    });

    /* Notification */
    await createNotification({
      recipient: alumniId,
      sender: req.user._id,
      type: "mentorship_request",
      message: "You received a new mentorship request",
      relatedId: mentorship._id,
    });

    /* Socket update */
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
====================================================
Alumni offers mentorship to student
====================================================
*/
export const offerMentorship = async (req, res) => {
  try {
    const { studentId, message } = req.body;

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const existing = await Mentorship.findOne({
      student: studentId,
      alumni: req.user._id,
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "Mentorship already exists",
      });
    }

    const mentorship = await Mentorship.create({
      student: studentId,
      alumni: req.user._id,
      message: message || "I'd like to mentor you.",
      initiatedBy: "alumni",
      status: "pending",
    });

    await createNotification({
      recipient: studentId,
      sender: req.user._id,
      type: "mentorship_request",
      message: "An alumni offered mentorship",
      relatedId: mentorship._id,
    });

    res.status(201).json(mentorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
====================================================
Respond to mentorship (accept / reject)
====================================================
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
        message: "Mentorship not found",
      });
    }

    /*
    Determine who is allowed to respond
    */
    if (
      mentorship.initiatedBy === "student" &&
      mentorship.alumni.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only alumni can respond",
      });
    }

    if (
      mentorship.initiatedBy === "alumni" &&
      mentorship.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only student can respond",
      });
    }

    mentorship.status = status;
    await mentorship.save();

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

    /* Notification message depends on initiator */

    const recipient =
      mentorship.initiatedBy === "student"
        ? mentorship.student
        : mentorship.alumni;

    await createNotification({
      recipient,
      sender: req.user._id,
      type: "mentorship_accepted",
      message: `Mentorship request ${status}`,
      relatedId: mentorship._id,
    });

    /* Socket update */

    const io = getIO();

    io.to(mentorship.student.toString()).emit(
      "mentorshipStatusUpdated",
      {
        mentorshipId: mentorship._id,
        alumniId: mentorship.alumni.toString(),
        status,
        conversationId: conversation?._id || null,
      }
    );

    res.json(mentorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
====================================================
Get mentorships
====================================================
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