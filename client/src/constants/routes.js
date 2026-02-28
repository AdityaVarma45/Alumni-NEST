const ROUTES = {
  LOGIN: "/",
  REGISTER: "/register",

  DASHBOARD: "/dashboard",
  CHAT: (id = ":conversationId") => `/dashboard/chat/${id}`,

  USERS: "/dashboard/users",
  USER_PROFILE: (id = ":id") => `/dashboard/users/${id}`,

  PROFILE_SETUP: "/dashboard/profile-setup",

  MENTORSHIP: "/dashboard/mentorship",
};

export default ROUTES;