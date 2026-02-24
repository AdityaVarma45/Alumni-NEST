import { useEffect, useState } from "react";
import { getRecommendedAlumni } from "../services/userService";

/*
  useRecommendedAlumni
  --------------------
  Smart data hook for recommendation engine

  ✔ fetches recommended alumni
  ✔ handles loading state
  ✔ handles errors safely
  ✔ keeps Dashboard clean
*/

export const useRecommendedAlumni = () => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommended = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getRecommendedAlumni();

        if (!isMounted) return;

        // safe fallback
        setRecommended(res?.data || []);
      } catch (err) {
        if (!isMounted) return;

        console.error("Recommendation fetch error:", err);
        setError(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecommended();

    // cleanup (prevents memory leaks)
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    recommended,
    loading,
    error,
  };
};