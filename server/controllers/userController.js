import User from "../models/User.js";
import { calculateSkillMatch } from "../utils/skillMatcher.js";

export const blockUser = async (req, res) => {
  try {
    const { userIdToBlock } = req.body;

    if (userIdToBlock === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot block yourself",
      });
    }

    const user = await User.findById(req.user._id);

    if (user.blockedUsers.includes(userIdToBlock)) {
      return res.status(400).json({
        message: "User already blocked",
      });
    }

    user.blockedUsers.push(userIdToBlock);
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===================================================
   Find best alumni matches for student
=================================================== */

export const getSkillMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // only match alumni
    const alumniUsers = await User.find({
      role: "alumni",
    });

    const matches = alumniUsers.map((alumni) => {
      const result = calculateSkillMatch(
        currentUser.skills,
        alumni.skills
      );

      return {
        _id: alumni._id,
        username: alumni.username,
        skills: alumni.skills,
        score: result.score,
        commonSkills: result.commonSkills,
      };
    });

    // sort best match first
    matches.sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};