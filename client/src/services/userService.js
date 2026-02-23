import axios from "../api/axios";

/* get recommended alumni */
export const getRecommendedAlumni = () =>
  axios.get("/users/recommended");