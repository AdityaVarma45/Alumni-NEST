import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import Users from "./pages/Users";
import MentorshipRequests from "./pages/MentorshipRequests";
import ProfileSetup from "./pages/ProfileSetup";
import UserProfile from "./pages/UserProfile";
import BlockedUsers from "./pages/BlockedUsers";

import ProtectedRoute from "./components/ProtectedRoute";
import ProfileGuard from "./components/ProfileGuard";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED APP SHELL */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProfileGuard>
                <DashboardLayout />
              </ProfileGuard>
            </ProtectedRoute>
          }
        >
          {/* Dashboard home */}
          <Route index element={<Dashboard />} />

          {/* Chat */}
          <Route path="chat/:conversationId" element={<ChatPage />} />

          {/* Users */}
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserProfile />} />

          {/* Mentorship */}
          <Route path="mentorship" element={<MentorshipRequests />} />

          {/* Profile */}
          <Route path="profile-setup" element={<ProfileSetup />} />

          {/* Blocked users */}
          <Route path="blocked-users" element={<BlockedUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;