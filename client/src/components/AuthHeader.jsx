import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function AuthHeader() {
  const location = useLocation();

  return (
    <header className="
      fixed top-0 left-0 w-full z-50
      bg-white/40 backdrop-blur-md
    ">

      <div className="
        h-16
        flex items-center justify-between
        px-4 sm:px-6 md:px-10
      ">

        <Logo size="text-2xl sm:text-3xl" />

        <div className="flex items-center gap-4 text-sm">

          {location.pathname !== "/login" && (
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Login
            </Link>
          )}

          {location.pathname !== "/register" && (
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Register
            </Link>
          )}

        </div>

      </div>

    </header>
  );
}