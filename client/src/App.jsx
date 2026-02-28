import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import Users from "./pages/Users";
import MentorshipRequests from "./pages/MentorshipRequests";
import ProfileSetup from "./pages/ProfileSetup";
import UserProfile from "./pages/UserProfile";
import BlockedUsers from "./pages/BlockedUsers";

import ProfileGuard from "./components/ProfileGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROTECTED DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="profile-setup" element={<ProfileSetup />} />

          <Route
            index
            element={
              <ProfileGuard>
                <Dashboard />
              </ProfileGuard>
            }
          />

          <Route
            path="chat/:conversationId"
            element={
              <ProfileGuard>
                <ChatPage />
              </ProfileGuard>
            }
          />

          <Route
            path="users"
            element={
              <ProfileGuard>
                <Users />
              </ProfileGuard>
            }
          />

          <Route
            path="users/:id"
            element={
              <ProfileGuard>
                <UserProfile />
              </ProfileGuard>
            }
          />

          <Route
            path="blocked-users"
            element={
              <ProfileGuard>
                <BlockedUsers />
              </ProfileGuard>
            }
          />

          <Route
            path="mentorship"
            element={
              <ProfileGuard>
                <MentorshipRequests />
              </ProfileGuard>
            }
          />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;