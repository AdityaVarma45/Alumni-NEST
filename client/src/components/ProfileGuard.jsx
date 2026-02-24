import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/*
  Prevent user entering dashboard
  if profile is not completed
*/

export default function ProfileGuard({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  // if profile not completed → redirect
  if (!user.profileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
}