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

import ProfileGuard from "./components/ProfileGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected dashboard shell */}
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
          <Route index element={<Dashboard />} />
          <Route path="chat/:conversationId" element={<ChatPage />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="profile-setup" element={<ProfileSetup />} />
          <Route path="blocked-users" element={<BlockedUsers />} />
          <Route path="mentorship" element={<MentorshipRequests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;