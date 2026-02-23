import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AppLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">

      {/* LEFT = permanent navigation */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* RIGHT = changing pages */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

    </div>
  );
}