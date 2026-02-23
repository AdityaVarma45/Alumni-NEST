import { useEffect, useState } from "react";
import { getRecommendedAlumni } from "../services/userService";

export const useRecommendedAlumni = () => {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await getRecommendedAlumni();
        setRecommended(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommended();
  }, []);

  return recommended;
};