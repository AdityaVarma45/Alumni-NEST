import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import socket from "../socket";

import { AuthContext } from "../context/AuthContext";

import RecommendedAlumniSection from "../components/recommendations/RecommendedAlumniSection";
import RecommendedStudentsSection from "../components/recommendations/RecommendedStudentsSection";

import { useRecommendedAlumni } from "../hooks/useRecommendedAlumni";

import {
  Briefcase,
  GraduationCap,
  MessageSquare,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

/* animated stat counter */
function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 400;
    const step = Math.ceil(value / (duration / 16));

    const interval = setInterval(() => {
      start += step;

      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  return <>{count}</>;
}

export default function DashboardHome() {
  const { user } = useContext(AuthContext);

  const [opportunities, setOpportunities] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [conversations, setConversations] = useState([]);

  const {
    alumni: recommendedAlumni,
    loading: recommendationsLoading,
  } = useRecommendedAlumni();

  /* ===============================
     INITIAL FETCH
  =============================== */

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

  /* ===============================
     REALTIME SOCKET UPDATES
  =============================== */

  useEffect(() => {
    if (!user) return;

    const handleConversationUpdate = () => {
      setConversations((prev) => [...prev]);
    };

    const handleMentorshipUpdate = () => {
      axios.get("/mentorship").then((res) => {
        setMentorships(res.data || []);
      });
    };

    const handleOpportunityUpdate = () => {
      axios.get("/opportunities").then((res) => {
        setOpportunities(res.data || []);
      });
    };

    socket.on("conversationUpdated", handleConversationUpdate);
    socket.on("mentorshipStatusUpdated", handleMentorshipUpdate);
    socket.on("newOpportunity", handleOpportunityUpdate);

    return () => {
      socket.off("conversationUpdated", handleConversationUpdate);
      socket.off("mentorshipStatusUpdated", handleMentorshipUpdate);
      socket.off("newOpportunity", handleOpportunityUpdate);
    };
  }, [user]);

  /* ===============================
     DERIVED DATA
  =============================== */

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

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.username}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Here’s what’s happening in your network.
        </p>
      </div>

      {/* ===============================
          STATS CARDS
      =============================== */}

      <div className="grid md:grid-cols-3 gap-4">

        {/* Opportunities */}
        <Link
          to="/dashboard/opportunities"
          className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
        >
          <div className="flex justify-between items-start">

            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Briefcase size={16} />
                </span>
                Opportunities
              </div>

              <p className="text-2xl font-bold text-slate-800 mt-2">
                <AnimatedNumber value={stats.opportunities} />
              </p>
            </div>

            <ArrowUpRight
              size={18}
              className="text-slate-300 group-hover:text-blue-500"
            />

          </div>
        </Link>

        {/* Mentorship */}
        <Link
          to={
            user?.role === "alumni"
              ? "/dashboard/mentorship"
              : "/dashboard/mentorship-offers"
          }
          className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
        >
          <div className="flex justify-between items-start">

            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <GraduationCap size={16} />
                </span>

                {user?.role === "alumni"
                  ? "Pending Requests"
                  : "Active Mentorships"}
              </div>

              <p className="text-2xl font-bold text-slate-800 mt-2">
                <AnimatedNumber value={stats.mentorship} />
              </p>
            </div>

            <ArrowUpRight
              size={18}
              className="text-slate-300 group-hover:text-indigo-500"
            />

          </div>
        </Link>

        {/* Conversations */}
        <Link
          to="/dashboard/chats"
          className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
        >
          <div className="flex justify-between items-start">

            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <MessageSquare size={16} />
                </span>
                Conversations
              </div>

              <p className="text-2xl font-bold text-slate-800 mt-2">
                <AnimatedNumber value={stats.conversations} />
              </p>
            </div>

            <ArrowUpRight
              size={18}
              className="text-slate-300 group-hover:text-emerald-500"
            />

          </div>
        </Link>

      </div>

      {/* ===============================
          RECOMMENDATIONS
      =============================== */}

      {user?.role === "student" && (
        <RecommendedAlumniSection
          alumni={recommendedAlumni}
          loading={recommendationsLoading}
        />
      )}

      {user?.role === "alumni" && (
        <RecommendedStudentsSection />
      )}

      {/* ===============================
          LATEST OPPORTUNITIES
      =============================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

        <h2 className="font-semibold text-slate-800 text-lg mb-4">
          Latest Opportunities
        </h2>

        {opportunities.slice(0, 3).map((o) => (
          <Link
            key={o._id}
            to="/dashboard/opportunities"
            className="block border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-50 hover:border-blue-200 transition mb-3"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="font-medium text-slate-800">{o.title}</p>
                <p className="text-xs text-slate-500 mt-1">{o.company}</p>
              </div>

              {o.type && (
                <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600 capitalize">
                  {o.type}
                </span>
              )}

            </div>
          </Link>
        ))}

        {/* CTA BUTTON */}
        <div className="mt-5 pt-4 border-t border-slate-100">

          <Link
            to="/dashboard/opportunities"
            className="
              flex items-center justify-center gap-2
              text-sm font-medium text-blue-600
              bg-blue-50 hover:bg-blue-100
              rounded-lg py-2
              transition
            "
          >
            Browse All Opportunities
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>

    </div>
  );
}