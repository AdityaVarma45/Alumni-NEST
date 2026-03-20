import axios from "axios";

/*
  Central axios instance
  Adds JWT automatically except auth routes
*/

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// request interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // don't attach token for login/register
  if (
    token &&
    !config.url.includes("/auth/login") &&
    !config.url.includes("/auth/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;