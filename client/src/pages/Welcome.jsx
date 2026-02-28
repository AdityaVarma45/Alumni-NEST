import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Welcome() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* ===== TOP LEFT LOGO ===== */}
      <div className="absolute top-6 left-6 z-20">
        <Logo size="text-3xl" />
      </div>

      {/* ===== BACKGROUND BLOBS ===== */}
      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40 animate-floatSlow" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-40 animate-floatSlowReverse" />

      {/* ===== MAIN CONTENT ===== */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="relative max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">

          {/* ===== LEFT HERO ===== */}
          <div className="animate-fadeUp">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Connect Students with
              <span className="text-blue-600"> Alumni Mentors</span>
            </h1>

            <p className="mt-5 text-gray-600 text-lg">
              AlumniNest helps students discover mentors, request guidance,
              and build meaningful career connections — all in one place.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* ===== RIGHT FEATURE CARD ===== */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border p-6 animate-fadeUp delay-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Why AlumniNest?
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li>🎯 Smart alumni recommendations</li>
              <li>💬 Real-time mentorship chat</li>
              <li>🧠 Skill-based matching engine</li>
              <li>🔒 Privacy & block controls</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}