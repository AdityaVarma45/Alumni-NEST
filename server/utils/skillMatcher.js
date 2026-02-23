/* ===================================================
   Skill Match Intelligence Engine
   compares two skill arrays
=================================================== */

export const calculateSkillMatch = (
  studentSkills = [],
  alumniSkills = []
) => {
  if (!studentSkills.length || !alumniSkills.length) {
    return {
      score: 0,
      commonSkills: [],
    };
  }

  // normalize (avoid case issues)
  const studentSet = new Set(
    studentSkills.map((s) => s.toLowerCase())
  );

  const commonSkills = alumniSkills.filter((skill) =>
    studentSet.has(skill.toLowerCase())
  );

  const score = Math.round(
    (commonSkills.length / studentSkills.length) * 100
  );

  return {
    score,
    commonSkills,
  };
};