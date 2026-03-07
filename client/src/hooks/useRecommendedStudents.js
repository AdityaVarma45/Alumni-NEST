import { useEffect, useState } from "react";
import axios from "../api/axios";

export const useRecommendedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/recommendations/students");

        const list = res.data || [];

        /* prioritize new matches */
        const newMatches = list.filter(
          (s) => !s.mentorshipStatus
        );

        const existingMatches = list.filter(
          (s) => s.mentorshipStatus
        );

        /* fallback if no new matches */
        const finalList =
          newMatches.length > 0
            ? newMatches
            : existingMatches.slice(0, 3);

        setStudents(finalList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, loading };
};