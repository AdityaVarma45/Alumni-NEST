import { useEffect, useState } from "react";
import { getRecommendedAlumni } from "../services/userService";

/*
  Fetch recommended alumni for dashboard

  Logic:
  1. Prefer new mentorship matches
  2. If none exist, fallback to best existing matches
*/

export const useRecommendedAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await getRecommendedAlumni();

        const list = Array.isArray(res.data) ? res.data : [];

        /* prioritize alumni with no mentorship yet */
        const newMatches = list.filter(
          (a) => !a.mentorshipStatus
        );

        /* already connected mentors */
        const existingMatches = list.filter(
          (a) => a.mentorshipStatus
        );

        /* fallback logic */
        const finalList =
          newMatches.length > 0
            ? newMatches
            : existingMatches.slice(0, 3);

        setAlumni(finalList);
      } catch (err) {
        console.error(err);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  return { alumni, loading };
};