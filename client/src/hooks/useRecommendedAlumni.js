import { useEffect, useState } from "react";
import { getRecommendedAlumni } from "../services/userService";

/*
  Fetch recommended alumni for dashboard
*/

export const useRecommendedAlumni = () => {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await getRecommendedAlumni();

        // IMPORTANT: use res.data (array)
        setRecommended(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setRecommended([]);
      }
    };

    fetchRecommended();
  }, []);

  return recommended;
};