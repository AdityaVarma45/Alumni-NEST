import { MASTER_SKILLS, MASTER_INTERESTS } from "../constants/skills.js";

/* =====================================================
   Skill Autocomplete Engine
   Returns matching skills based on search text
===================================================== */

export const searchSkills = async (req, res) => {
  try {
    const query = (req.query.q || "").toLowerCase();

    // if empty → return top skills
    if (!query) {
      return res.json(MASTER_SKILLS.slice(0, 15));
    }

    const results = MASTER_SKILLS.filter((skill) =>
      skill.toLowerCase().includes(query)
    ).slice(0, 10);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   Interest Autocomplete (same idea)
===================================================== */

export const searchInterests = async (req, res) => {
  try {
    const query = (req.query.q || "").toLowerCase();

    if (!query) {
      return res.json(MASTER_INTERESTS.slice(0, 15));
    }

    const results = MASTER_INTERESTS.filter((interest) =>
      interest.toLowerCase().includes(query)
    ).slice(0, 10);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};