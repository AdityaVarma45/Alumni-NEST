import { MASTER_SKILLS, MASTER_INTERESTS } from "../constants/skills.js";

/* =====================================================
   Validate skills coming from client
===================================================== */

export const validateSkills = (skills = []) => {
  return skills.every((skill) =>
    MASTER_SKILLS.includes(skill)
  );
};

export const validateInterests = (interests = []) => {
  return interests.every((interest) =>
    MASTER_INTERESTS.includes(interest)
  );
};