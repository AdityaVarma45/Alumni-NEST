import User from "../models/User.js";
import { calculateSkillMatch } from "../utils/skillMatcher.js";
import Mentorship from "../models/Mentorship.js";
import { isUserOnline } from "../socket/socket.js";

// block user
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

//
export const getAllUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const users = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currentUser.blockedUsers,
      },
      blockedUsers: {
        $nin: [req.user._id],
      },
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
      const result = calculateSkillMatch(currentUser.skills, alumni.skills);

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
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (currentUser.role !== "student") {
      return res.status(400).json({
        message: "Only students can get recommendations",
      });
    }

    const alumniUsers = await User.find({
      role: "alumni",
      _id: { $nin: currentUser.blockedUsers || [] },
      blockedUsers: { $nin: [currentUser._id] },
    }).select("-password");

    const mentorships = await Mentorship.find({
      student: currentUser._id,
    });

    const mentorshipMap = {};
    mentorships.forEach((m) => {
      mentorshipMap[m.alumni.toString()] = m;
    });

    const scoredAlumni = alumniUsers
      .map((alumni) => {
        const match = calculateSkillMatch(
          currentUser.skills || [],
          alumni.skills || [],
          currentUser.interests || [],
          alumni.interests || []
        );

        const mentorship =
          mentorshipMap[alumni._id.toString()];

        return {
          ...alumni.toObject(),
          matchScore: match.score,
          matchLabel: match.label,
          commonSkills: match.commonSkills,
          commonInterests: match.commonInterests,
          mentorshipStatus: mentorship?.status || null,
          mentorshipId: mentorship?._id || null,
        };
      })
      // hide weak matches (product polish)
      .filter((a) => a.matchScore >= 25);

    scoredAlumni.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    res.json(scoredAlumni.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get recommendations",
    });
  }
};

// update profile setup (skills + interests)
export const updateProfileSetup = async (req, res) => {
  try {
    const { skills, interests } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update profile fields
    user.skills = skills || [];
    user.interests = interests || [];
    user.profileCompleted = true;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setupProfile = async (req, res) => {
  try {
    const { skills, interests } = req.body;

    // fetch real mongoose document
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // update fields
    user.skills = skills || [];
    user.interests = interests || [];
    user.profileCompleted = true;

    // save to DB
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// get specific user profile (for viewing other users)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      ...user.toObject(),
      online: isUserOnline(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get blocked users list
export const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "blockedUsers",
      "username email role lastSeen",
    );

    res.json(user.blockedUsers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// unblock user
export const unblockUser = async (req, res) => {
  try {
    const { userIdToUnblock } = req.body;

    const user = await User.findById(req.user._id);

    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== userIdToUnblock,
    );

    await user.save();

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
