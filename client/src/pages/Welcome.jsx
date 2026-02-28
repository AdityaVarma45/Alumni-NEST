import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Welcome to <span className="text-blue-600">AlumniNest</span>
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Connect students with alumni mentors, build meaningful conversations,
          and grow your career together.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-white border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}