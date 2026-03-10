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

      {/* ===== LOGO ===== */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-20">
        <Logo size="text-2xl sm:text-3xl" />
      </div>

      {/* ===== BACKGROUND BLOBS ===== */}
      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40 animate-floatSlow" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-40 animate-floatSlowReverse" />

      <div className="relative z-10">

        {/* ================= HERO ================= */}
        <section className="min-h-screen flex items-center justify-center px-5 sm:px-6">

          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 md:gap-12 items-center">

            {/* ===== HERO TEXT ===== */}
            <div className="animate-fadeUp text-center md:text-left">

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Bridge the Gap Between
                <span className="text-blue-600"> Students & Alumni</span>
              </h1>

              <p className="mt-5 text-gray-600 text-base sm:text-lg">
                Discover mentors, request guidance, and build meaningful
                career connections with alumni who were once in your place.
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Get personalized mentor recommendations based on your
                skills and interests.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">

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

            </div>

            {/* ===== FEATURE CARD ===== */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border p-5 sm:p-6 animate-fadeUp delay-200">

              <h3 className="text-lg font-semibold text-gray-800 mb-5">
                What you can do on AlumniNest
              </h3>

              <div className="space-y-4">

                <div className="flex items-start gap-3">
                  <GraduationCap className="text-blue-600" size={20} />
                  <p className="text-gray-600 text-sm">
                    Discover alumni mentors based on your skills and interests.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="text-blue-600" size={20} />
                  <p className="text-gray-600 text-sm">
                    Chat with mentors and receive real-time career guidance.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="text-blue-600" size={20} />
                  <p className="text-gray-600 text-sm">
                    Explore internships, job referrals, and opportunities shared by alumni.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="text-blue-600" size={20} />
                  <p className="text-gray-600 text-sm">
                    Build a strong professional network with students and alumni.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= FEATURES ================= */}
        <section className="py-16 sm:py-20 px-5 sm:px-6">

          <div className="max-w-6xl mx-auto">

            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
              Designed for Meaningful Mentorship
            </h2>

            <p className="text-center text-gray-600 mt-3">
              AlumniNest helps students connect with alumni mentors and grow their careers.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-10 md:mt-12">

              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-800">
                  Skill-Based Matching
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Our recommendation engine suggests alumni mentors based on
                  your skills and career interests.
                </p>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-800">
                  Mentorship Requests
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Send mentorship requests or receive mentorship offers from alumni
                  interested in guiding you.
                </p>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-800">
                  Opportunity Sharing
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Alumni share internships, job openings, and referrals
                  to help students grow professionally.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ================= CTA ================= */}
        <section className="py-16 sm:py-20 px-5 sm:px-6">

          <div className="max-w-4xl mx-auto text-center bg-blue-600 rounded-2xl text-white p-8 sm:p-12 shadow-xl">

            <h2 className="text-2xl sm:text-3xl font-bold">
              Start Your Mentorship Journey
            </h2>

            <p className="mt-3 text-blue-100 text-sm sm:text-base">
              Join AlumniNest to connect with mentors, explore opportunities,
              and grow your professional network.
            </p>

            <div className="mt-8">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Create Your Account
              </Link>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}