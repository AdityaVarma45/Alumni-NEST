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

/* ===================================================
   Recommended Alumni Engine
   finds best mentors for current student
=================================================== */
export const getRecommendedAlumni = async (req, res) => {
  try {
    const currentUser = req.user;

    // only students need recommendations
    if (currentUser.role !== "student") {
      return res.status(400).json({
        message: "Only students can get recommendations",
      });
    }

    // fetch all alumni
    const alumniUsers = await User.find({
      role: "alumni",
    }).select("-password");

    // calculate match score for each alumni
    const scoredAlumni = alumniUsers.map((alumni) => {
      const match = calculateSkillMatch(
        currentUser.skills || [],
        alumni.skills || []
      );

      return {
        ...alumni.toObject(),
        matchScore: match.score,
        commonSkills: match.commonSkills,
      };
    });

    // sort by best match
    scoredAlumni.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    // return top 10 (clean UI)
    res.json(scoredAlumni.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get recommendations",
    });
  }
};