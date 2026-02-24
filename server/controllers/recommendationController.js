import User from "../models/User.js";
import { calculateSkillMatch } from "../utils/skillMatcher.js";
import { isUserOnline } from "../socket/socket.js";

/* ===================================================
   Recommended Alumni Engine
   ---------------------------------------------------
   Smart ranking based on:
   - skill match
   - online status
   - recent activity
=================================================== */

export const getRecommendedAlumni = async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // get all alumni except current user
    const alumniUsers = await User.find({
      role: "alumni",
      _id: { $ne: currentUser._id },
    }).select("username skills lastSeen role");

    // build ranked list
    const rankedAlumni = alumniUsers.map((alumni) => {
      // skill intelligence
      const match = calculateSkillMatch(
        currentUser.skills || [],
        alumni.skills || []
      );

      // online bonus
      const onlineBonus = isUserOnline(alumni._id)
        ? 20
        : 0;

      // recent activity bonus
      let activeBonus = 0;

      if (alumni.lastSeen) {
        const diff =
          Date.now() -
          new Date(alumni.lastSeen).getTime();

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

    // sort by score
    rankedAlumni.sort(
      (a, b) => b.finalScore - a.finalScore
    );

    res.status(200).json(rankedAlumni);
  } catch (error) {
    console.error("Recommendation error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};