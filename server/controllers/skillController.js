import { MASTER_SKILLS, MASTER_INTERESTS } from "../constants/skills.js";

/*
  Search skills
  Used for autocomplete dropdown
*/
export const searchSkills = async (req, res) => {
  try {
    const query = (req.query.q || "").toLowerCase();

    // if no query → return default top skills
    if (!query) {
      return res.json(MASTER_SKILLS.slice(0, 15));
    }

    const results = MASTER_SKILLS
      .filter((skill) =>
        skill.toLowerCase().includes(query)
      )
      .slice(0, 10);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
  Search interests
  Same logic as skills
*/
export const searchInterests = async (req, res) => {
  try {
    const query = (req.query.q || "").toLowerCase();

    if (!query) {
      return res.json(MASTER_INTERESTS.slice(0, 15));
    }

    const results = MASTER_INTERESTS
      .filter((interest) =>
        interest.toLowerCase().includes(query)
      )
      .slice(0, 10);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};