import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// This component protects routes that require a completed profile.
export default function ProfileGuard({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // wait until user loads
  if (!user) return null;

  // already on profile setup page → allow
  if (location.pathname === "/dashboard/profile-setup") {
    return children;
  }

  // redirect if profile not completed
  if (!user.profileCompleted) {
    return (
      <Navigate
        to="/dashboard/profile-setup"
        replace
      />
    );
  }

  return children;
}