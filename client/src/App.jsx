import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";

import DashboardHome from "./pages/DashboardHome";
import Notifications from "./pages/Notifications"; 
import Chats from "./pages/Chats";
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

        {/* PUBLIC */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="profile-setup" element={<ProfileSetup />} />

          {/* OVERVIEW */}
          <Route
            index
            element={
              <ProfileGuard>
                <DashboardHome />
              </ProfileGuard>
            }
          />

          {/*  NOTIFICATIONS */}
          <Route
            path="notifications"
            element={
              <ProfileGuard>
                <Notifications />
              </ProfileGuard>
            }
          />

          {/* CHATS */}
          <Route
            path="chats"
            element={
              <ProfileGuard>
                <Chats />
              </ProfileGuard>
            }
          />

          {/* SINGLE CHAT */}
          <Route
            path="chat/:conversationId"
            element={
              <ProfileGuard>
                <ChatPage />
              </ProfileGuard>
            }
          />

          {/* USERS */}
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

          {/* PROFILE */}
          <Route
            path="my-profile"
            element={
              <ProfileGuard>
                <MyProfile />
              </ProfileGuard>
            }
          />

          {/* BLOCKED */}
          <Route
            path="blocked-users"
            element={
              <ProfileGuard>
                <BlockedUsers />
              </ProfileGuard>
            }
          />

          {/* MENTORSHIP */}
          <Route
            path="mentorship"
            element={
              <ProfileGuard>
                <MentorshipRequests />
              </ProfileGuard>
            }
          />

          {/* OPPORTUNITIES */}
          <Route
            path="opportunities"
            element={
              <ProfileGuard>
                <Opportunities />
              </ProfileGuard>
            }
          />

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