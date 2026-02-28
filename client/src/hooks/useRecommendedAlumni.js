import { useEffect, useState } from "react";
import { getRecommendedAlumni } from "../services/userService";

/*
  Fetch recommended alumni for dashboard
*/

export const useRecommendedAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await getRecommendedAlumni();

        setAlumni(
          Array.isArray(res.data) ? res.data : []
        );
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