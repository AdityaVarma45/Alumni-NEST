import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import MentorshipRequests from "./pages/MentorshipRequests";
import ChatPage from "./pages/ChatPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout"; // 👈 NEW layout wrapper

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#111827",
            color: "#fff",
          },
        }}
      />
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- PROTECTED APP SHELL ---------- */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* dashboard main */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* chat opens INSIDE layout */}
          <Route
            path="/dashboard/chat/:conversationId"
            element={<ChatPage />}
          />

          {/* other pages */}
          <Route path="/users" element={<Users />} />
          <Route path="/mentorship" element={<MentorshipRequests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
