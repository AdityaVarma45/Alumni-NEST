import axios from "../api/axios";

// get requests (role based from backend)
export const getMentorshipRequests = () =>
  axios.get("/mentorship");

// alumni responds
export const respondMentorship = (id, status) =>
  axios.put(`/mentorship/respond/${id}`, { status });