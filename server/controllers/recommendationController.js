import User from "../models/User.js";
import Mentorship from "../models/Mentorship.js";
import { calculateSkillMatch } from "../utils/skillMatcher.js";
import { isUserOnline } from "../socket/socket.js";

/* ===================================================
   Recommended Alumni Engine
=================================================== */

export const getRecommendedAlumni = async (req, res) => {
  try {
    const currentUser = req.user;

    const alumniUsers = await User.find({
      role: "alumni",
      _id: { $ne: currentUser._id },
    }).select("username skills lastSeen role");

    const rankedAlumni = alumniUsers.map((alumni) => {
      const match = calculateSkillMatch(
        currentUser.skills || [],
        alumni.skills || []
      );

      const onlineBonus = isUserOnline(alumni._id) ? 20 : 0;

      let activeBonus = 0;
      if (alumni.lastSeen) {
        const diff =
          Date.now() - new Date(alumni.lastSeen).getTime();

        if (diff < 24 * 60 * 60 * 1000) {
          activeBonus = 10;
        }
      }

      const finalScore =
        match.score * 0.7 + onlineBonus + activeBonus;

      return {
        ...alumni.toObject(),
        matchScore: match.score,
        finalScore,
        commonSkills: match.commonSkills,
        online: isUserOnline(alumni._id),
      };
    });

    rankedAlumni.sort((a, b) => b.finalScore - a.finalScore);

    res.status(200).json(rankedAlumni);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================================================
   Recommended Students Engine
=================================================== */

export const getRecommendedStudents = async (req, res) => {
  try {
    const currentUser = req.user;

    if (currentUser.role !== "alumni") {
      return res.status(403).json({
        message: "Only alumni can access this",
      });
    }

    const students = await User.find({
      role: "student",
      _id: { $ne: currentUser._id },
    }).select("username skills lastSeen role");

    const mentorships = await Mentorship.find({
      alumni: currentUser._id,
    });

    const mentorshipMap = {};
    mentorships.forEach((m) => {
      mentorshipMap[m.student.toString()] = m;
    });

    const rankedStudents = students.map((student) => {
      const match = calculateSkillMatch(
        currentUser.skills || [],
        student.skills || []
      );

      const mentorship = mentorshipMap[student._id.toString()];

      return {
        ...student.toObject(),
        matchScore: match.score,
        commonSkills: match.commonSkills,
        mentorshipStatus: mentorship?.status || null,
      };
    });

    rankedStudents.sort((a, b) => b.matchScore - a.matchScore);

    res.json(rankedStudents.slice(0, 10));
  } catch (error) {
    res.status(500).json({
      message: "Failed to get recommended students",
    });
  }
};