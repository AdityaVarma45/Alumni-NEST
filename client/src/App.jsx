import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import MentorshipRequests from "./pages/MentorshipRequests";
import ChatPage from "./pages/ChatPage";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD LOOK & FEEL (shared layout) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/chat/:conversationId" element={<ChatPage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/mentorship" element={<MentorshipRequests />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;