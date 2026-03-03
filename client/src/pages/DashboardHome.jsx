import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import RecommendedAlumniSection from "../components/recommendations/RecommendedAlumniSection";
import { useRecommendedAlumni } from "../hooks/useRecommendedAlumni";

import {
  Briefcase,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

export default function DashboardHome() {
  const { user } = useContext(AuthContext);

  const [opportunities, setOpportunities] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [conversations, setConversations] = useState([]);

  const {
    alumni: recommendedAlumni,
    loading: recommendationsLoading,
  } = useRecommendedAlumni();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppRes, mentRes, convoRes] = await Promise.all([
          axios.get("/opportunities"),
          axios.get("/mentorship"),
          axios.get("/chat/conversations"),
        ]);

        setOpportunities(oppRes.data || []);
        setMentorships(mentRes.data || []);
        setConversations(convoRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  /* ===== Derived Data ===== */

  const myOpportunities =
    user?.role === "alumni"
      ? opportunities.filter((o) => o.postedBy?._id === user.id)
      : [];

  const pendingRequests =
    user?.role === "alumni"
      ? mentorships.filter((m) => m.status === "pending")
      : [];

  const acceptedMentorships =
    user?.role === "student"
      ? mentorships.filter((m) => m.status === "accepted")
      : [];

  const stats = useMemo(() => {
    return {
      opportunities: opportunities.length,
      mentorship:
        user?.role === "alumni"
          ? pendingRequests.length
          : acceptedMentorships.length,
      conversations: conversations.length,
    };
  }, [
    opportunities,
    pendingRequests,
    acceptedMentorships,
    conversations,
    user?.role,
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.username}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here’s what’s happening in your network.
        </p>
      </div>

      {/* ================= SNAPSHOT STATS ================= */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <Briefcase size={16} />
            Opportunities
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {stats.opportunities}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <GraduationCap size={16} />
            {user?.role === "alumni"
              ? "Pending Requests"
              : "Active Mentorships"}
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {stats.mentorship}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <MessageSquare size={16} />
            Conversations
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {stats.conversations}
          </p>
        </div>

      </div>

      {/* ================= RECOMMENDED ALUMNI (CORE FEATURE) ================= */}
      {user?.role === "student" && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-4">
            Recommended Alumni
          </h2>

          <RecommendedAlumniSection
            alumni={recommendedAlumni}
            loading={recommendationsLoading}
          />
        </section>
      )}

      {/* ================= OPPORTUNITY PREVIEW ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-slate-800">
            {user?.role === "alumni"
              ? "Your Recent Posts"
              : "Latest Opportunities"}
          </h2>

          <Link
            to="/dashboard/opportunities"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {(user?.role === "alumni"
          ? myOpportunities.slice(0, 3)
          : opportunities.slice(0, 3)
        ).length === 0 ? (
          <p className="text-sm text-slate-500">
            No opportunities yet.
          </p>
        ) : (
          (user?.role === "alumni"
            ? myOpportunities.slice(0, 3)
            : opportunities.slice(0, 3)
          ).map((o) => (
            <div key={o._id} className="mb-3 last:mb-0">
              <p className="text-sm font-medium text-slate-700">
                {o.title}
              </p>
              <p className="text-xs text-slate-500">
                {o.company}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ================= QUICK ACTION FOR ALUMNI ================= */}
      {user?.role === "alumni" && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-800">
            Share a new opportunity
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Help students by posting internships, jobs, or referrals.
          </p>

          <Link
            to="/dashboard/opportunities/create"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Post Opportunity
          </Link>
        </div>
      )}

    </div>
  );
}