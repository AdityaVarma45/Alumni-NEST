import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import {
  FiStar,
  FiTarget,
  FiShield,
  FiClock,
  FiMessageCircle,
} from "react-icons/fi";

/* skeleton */
function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
      <div className="rounded-2xl border border-slate-200 bg-white h-36" />
      <div className="rounded-xl border border-slate-200 bg-white h-24" />
      <div className="rounded-xl border border-slate-200 bg-white h-28" />
      <div className="rounded-xl border border-slate-200 bg-white h-28" />
    </div>
  );
}

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blocking, setBlocking] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [mentorships, setMentorships] = useState([]);

  /* local mentorship status (instant UI update) */
  const [localStatus, setLocalStatus] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, convoRes, mentorshipRes] =
          await Promise.all([
            axios.get(`/users/${id}`),
            axios.get("/chat/conversations"),
            axios.get("/mentorship"),
          ]);

        setProfile(profileRes.data);
        setConversations(convoRes.data || []);
        setMentorships(mentorshipRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const handleBlock = async () => {
    try {
      setBlocking(true);

      await axios.post("/users/block", {
        userIdToBlock: profile._id,
      });

      alert("User blocked successfully");
      navigate("/dashboard/users");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to block");
    } finally {
      setBlocking(false);
    }
  };

  /* helpers */

  const findConversation = () =>
    conversations.find((c) =>
      c.participants?.some((p) => p._id === profile?._id)
    );

  const mentorship = mentorships.find((m) => {
    const alumniId = m.alumni?._id || m.alumni;
    const studentId = m.student?._id || m.student;

    return (
      alumniId === profile?._id ||
      studentId === profile?._id
    );
  });

  /* student sends mentorship request */
  const sendRequest = async () => {
    try {
      await axios.post("/mentorship/request", {
        alumniId: profile._id,
        message: "I would like mentorship",
      });

      setLocalStatus("pending");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  /* alumni offers mentorship */
  const offerMentorship = async () => {
    try {
      await axios.post("/mentorship/offer", {
        studentId: profile._id,
        message: "I'd like to mentor you.",
      });

      setLocalStatus("pending");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const renderActionButton = () => {
    if (!profile || profile._id === user?.id) return null;

    const conversation = findConversation();

    /* ==============================
       STUDENT VIEWING ALUMNI
    ============================== */

    if (user?.role === "student" && profile.role === "alumni") {

      if (localStatus === "pending" || mentorship?.status === "pending")
        return (
          <span className="text-yellow-600 text-sm">
            Request Pending
          </span>
        );

      if (mentorship?.status === "accepted" && conversation)
        return (
          <Link
            to={`/dashboard/chat/${conversation._id}`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm shadow-sm transition"
          >
            <FiMessageCircle />
            Start Chat
          </Link>
        );

      if (mentorship?.status === "rejected")
        return (
          <span className="text-red-500 text-sm">
            Request Rejected
          </span>
        );

      return (
        <button
          onClick={sendRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm shadow-sm transition"
        >
          Request Mentorship
        </button>
      );
    }

    /* ==============================
       ALUMNI VIEWING STUDENT
    ============================== */

    if (user?.role === "alumni" && profile.role === "student") {

      if (localStatus === "pending" || mentorship?.status === "pending")
        return (
          <span className="text-yellow-600 text-sm">
            Offer Pending
          </span>
        );

      if (mentorship?.status === "accepted" && conversation)
        return (
          <Link
            to={`/dashboard/chat/${conversation._id}`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm shadow-sm transition"
          >
            <FiMessageCircle />
            Start Chat
          </Link>
        );

      return (
        <button
          onClick={offerMentorship}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm shadow-sm transition"
        >
          Offer Mentorship
        </button>
      );
    }

    return null;
  };

  /* states */

  if (loading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-slate-500">User not found</p>
      </div>
    );
  }

  const statusLabel = profile.online
    ? "Online"
    : profile.lastSeen
    ? `Last seen ${new Date(profile.lastSeen).toLocaleString()}`
    : "Offline";

  const initial =
    profile.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            {initial}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">
              {profile.username}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 capitalize">
                {profile.role}
              </span>

              <span
                className={`text-xs flex items-center gap-1 ${
                  profile.online ? "text-green-600" : "text-slate-500"
                }`}
              >
                <FiClock size={12} />
                {statusLabel}
              </span>
            </div>

            <p className="text-sm text-slate-500 mt-2">
              {profile.email}
            </p>
          </div>

          {renderActionButton()}
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">
            {profile.skills?.length || 0}
          </p>
          <p className="text-xs text-slate-500">Skills</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">
            {profile.interests?.length || 0}
          </p>
          <p className="text-xs text-slate-500">Interests</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800 capitalize">
            {profile.role}
          </p>
          <p className="text-xs text-slate-500">Role</p>
        </div>
      </section>

      {/* SKILLS */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-3">
          <FiStar className="text-blue-600" />
          Skills
        </h3>

        {profile.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No skills added</p>
        )}
      </section>

      {/* INTERESTS */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-3">
          <FiTarget className="text-blue-600" />
          Interests
        </h3>

        {profile.interests?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-700"
              >
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No interests added</p>
        )}
      </section>

      {/* BLOCK */}
      {profile._id !== user?.id && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <button
            onClick={handleBlock}
            disabled={blocking}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm transition"
          >
            <FiShield />
            {blocking ? "Blocking..." : "Block User"}
          </button>
        </section>
      )}
    </div>
  );
}