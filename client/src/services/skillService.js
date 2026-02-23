import axios from "../api/axios";

/* fetch matching skills */
export const searchSkills = (query) =>
  axios.get(`/meta/skills?q=${query}`);

/* fetch matching interests */
export const searchInterests = (query) =>
  axios.get(`/meta/interests?q=${query}`);