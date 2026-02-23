import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

/*
  DashboardLayout
  ----------------
  This component controls the FULL dashboard structure.

  Sidebar lives here once.
  Every dashboard page renders inside <Outlet />.
*/

export default function DashboardLayout() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* left fixed navigation */}
      <Sidebar user={user} />

      {/* right dynamic content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
}