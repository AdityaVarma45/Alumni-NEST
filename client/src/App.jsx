import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";

import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import Users from "./pages/Users";
import MentorshipRequests from "./pages/MentorshipRequests";
import ProfileSetup from "./pages/ProfileSetup";
import UserProfile from "./pages/UserProfile";
import BlockedUsers from "./pages/BlockedUsers";
import Opportunities from "./pages/Opportunities";
import CreateOpportunity from "./pages/CreateOpportunity"; 

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

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* profile setup */}
          <Route path="profile-setup" element={<ProfileSetup />} />

          {/* chats dashboard */}
          <Route
            index
            element={
              <ProfileGuard>
                <Dashboard />
              </ProfileGuard>
            }
          />

          {/* chat page */}
          <Route
            path="chat/:conversationId"
            element={
              <ProfileGuard>
                <ChatPage />
              </ProfileGuard>
            }
          />

          {/* users */}
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

          {/* my profile */}
          <Route
            path="my-profile"
            element={
              <ProfileGuard>
                <MyProfile />
              </ProfileGuard>
            }
          />

          {/* blocked users */}
          <Route
            path="blocked-users"
            element={
              <ProfileGuard>
                <BlockedUsers />
              </ProfileGuard>
            }
          />

          {/* mentorship */}
          <Route
            path="mentorship"
            element={
              <ProfileGuard>
                <MentorshipRequests />
              </ProfileGuard>
            }
          />

          {/*  OPPORTUNITY FEED */}
          <Route
            path="opportunities"
            element={
              <ProfileGuard>
                <Opportunities />
              </ProfileGuard>
            }
          />

          {/* CREATE OPPORTUNITY PAGE */}
          <Route
            path="opportunities/create"
            element={
              <ProfileGuard>
                <CreateOpportunity />
              </ProfileGuard>
            }
          />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;