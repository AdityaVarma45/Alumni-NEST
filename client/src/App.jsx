import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import Users from "./pages/Users";
import MentorshipRequests from "./pages/MentorshipRequests";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileGuard from "./components/ProfileGuard";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* profile setup after registration/login */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />

        {/* dashboard shell (sidebar + layout stays) */}
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
          {/* right side pages inside dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="chat/:conversationId" element={<ChatPage />} />
        </Route>

        {/* other protected pages */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentorship"
          element={
            <ProtectedRoute>
              <MentorshipRequests />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
