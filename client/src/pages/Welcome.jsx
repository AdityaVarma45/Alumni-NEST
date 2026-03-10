import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import {
  GraduationCap,
  MessageSquare,
  Briefcase,
  Users,
} from "lucide-react";

export default function Welcome() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* LOGO */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-20">
        <Logo size="text-2xl sm:text-3xl" />
      </div>

      {/* BACKGROUND BLOBS */}
      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40 animate-floatSlow" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-40 animate-floatSlowReverse" />

      <div className="relative z-10">

        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center px-5 sm:px-6">

          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

            {/* HERO TEXT */}
            <div className="animate-fadeUp text-center md:text-left">

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Bridge the Gap Between
                <span className="text-blue-600"> Students & Alumni</span>
              </h1>

              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                Discover mentors, request guidance, and build meaningful
                career connections with alumni who were once in your place.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Skill-based mentor discovery and real-time conversations.
              </p>

              {/* ACTION BUTTONS */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">

                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-7 py-3 rounded-lg hover:bg-blue-700 transition shadow-md text-center"
                >
                  Join AlumniNest
                </Link>

                <Link
                  to="/login"
                  className="border border-gray-300 px-7 py-3 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Login
                </Link>

              </div>

              {/* DEMO LINK */}
              <div className="mt-4 text-sm text-gray-500">
                <Link
                  to="/demo"
                  className="text-blue-600 hover:text-blue-700 font-medium transition"
                >
                  Explore the platform with demo credentials →
                </Link>
              </div>

            </div>

            {/* FEATURE PREVIEW CARD */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border p-5 sm:p-6 animate-fadeUp delay-200">

              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                What you can do on AlumniNest
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex items-start gap-3">
                  <GraduationCap className="text-blue-600" size={18} />
                  <p className="text-gray-600">
                    Discover alumni mentors based on your skills.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="text-blue-600" size={18} />
                  <p className="text-gray-600">
                    Chat with mentors and receive career guidance.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="text-blue-600" size={18} />
                  <p className="text-gray-600">
                    Explore internships and job opportunities.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="text-blue-600" size={18} />
                  <p className="text-gray-600">
                    Build your professional network.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* COMPACT FEATURE STRIP */}
        <section className="py-8 px-5 sm:px-6">

          <div className="max-w-5xl mx-auto">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

              <div className="bg-white border rounded-lg py-3 px-4 shadow-sm flex flex-col items-center gap-1 text-sm">
                <GraduationCap size={18} className="text-blue-600" />
                Mentor Discovery
              </div>

              <div className="bg-white border rounded-lg py-3 px-4 shadow-sm flex flex-col items-center gap-1 text-sm">
                <MessageSquare size={18} className="text-blue-600" />
                Real-Time Chat
              </div>

              <div className="bg-white border rounded-lg py-3 px-4 shadow-sm flex flex-col items-center gap-1 text-sm">
                <Briefcase size={18} className="text-blue-600" />
                Opportunities
              </div>

              <div className="bg-white border rounded-lg py-3 px-4 shadow-sm flex flex-col items-center gap-1 text-sm">
                <Users size={18} className="text-blue-600" />
                Alumni Network
              </div>

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="py-12 px-5 sm:px-6">

          <div className="max-w-4xl mx-auto text-center bg-blue-600 rounded-2xl text-white p-8 shadow-xl">

            <h2 className="text-2xl sm:text-3xl font-bold">
              Start Your Mentorship Journey
            </h2>

            <p className="mt-2 text-blue-100 text-sm sm:text-base">
              Connect with alumni mentors and explore real opportunities.
            </p>

            <div className="mt-6">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Create Your Account
              </Link>
            </div>

          </div>

        </section>

        {/* FOOTER */}
        <footer className="border-t bg-white/70 backdrop-blur-sm py-6">

          <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

            <div className="flex items-center gap-2">
              <Logo size="text-lg" />
              <span>© {new Date().getFullYear()} AlumniNest</span>
            </div>

            <div className="flex gap-4">

              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>

              <Link to="/register" className="hover:text-blue-600">
                Register
              </Link>

              <Link to="/demo" className="hover:text-blue-600">
                Demo
              </Link>

            </div>

          </div>

        </footer>

      </div>
    </div>
  );
}