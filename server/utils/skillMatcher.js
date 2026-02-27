/* ===================================================
   Match Quality Engine
   weighted scoring system
=================================================== */

const normalize = (arr = []) =>
  arr.map((v) => v.toLowerCase().trim());

export const calculateSkillMatch = (
  studentSkills = [],
  alumniSkills = [],
  studentInterests = [],
  alumniInterests = []
) => {
  // no data safety
  if (!studentSkills.length || !alumniSkills.length) {
    return {
      score: 0,
      commonSkills: [],
      commonInterests: [],
      label: "Low Match",
    };
  }

  const studentSkillSet = new Set(normalize(studentSkills));
  const alumniSkillSet = new Set(normalize(alumniSkills));

  const studentInterestSet = new Set(normalize(studentInterests));
  const alumniInterestSet = new Set(normalize(alumniInterests));

  // common skills
  const commonSkills = [...alumniSkillSet].filter((s) =>
    studentSkillSet.has(s)
  );

  // common interests
  const commonInterests = [...alumniInterestSet].filter((i) =>
    studentInterestSet.has(i)
  );

  /* ==============================
     WEIGHTED SCORING
  ============================== */

  // skill match weight (60)
  const skillScore =
    (commonSkills.length / studentSkillSet.size) * 60;

  // interest match weight (25)
  const interestScore =
    studentInterestSet.size > 0
      ? (commonInterests.length / studentInterestSet.size) * 25
      : 0;

  // depth bonus (experienced alumni)
  const depthBonus =
    alumniSkillSet.size >= 10
      ? 15
      : alumniSkillSet.size >= 6
      ? 10
      : 5;

  const finalScore = Math.min(
    100,
    Math.round(skillScore + interestScore + depthBonus)
  );

  // human readable label
  let label = "Good Match";
  if (finalScore >= 80) label = "Best Match";
  else if (finalScore >= 60) label = "Strong Match";

  return {
    score: finalScore,
    commonSkills,
    commonInterests,
    label,
  };
};