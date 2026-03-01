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
    <div className="p-6 max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="bg-white border rounded-2xl h-36" />
      <div className="bg-white border rounded-2xl h-28" />
      <div className="bg-white border rounded-2xl h-28" />
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

  /* ---------- smart helpers ---------- */

  const findConversation = () =>
    conversations.find((c) =>
      c.participants?.some((p) => p._id === profile?._id)
    );

  const mentorship = mentorships.find(
    (m) => (m.alumni?._id || m.alumni) === profile?._id
  );

  const sendRequest = async () => {
    try {
      await axios.post("/mentorship/request", {
        alumniId: profile._id,
        message: "I would like mentorship",
      });

      alert("Mentorship request sent");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const renderActionButton = () => {
    if (!profile || profile._id === user?.id) return null;

    const conversation = findConversation();

    // existing chat
    if (conversation) {
      return (
        <Link
          to={`/dashboard/chat/${conversation._id}`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          <FiMessageCircle />
          Start Chat
        </Link>
      );
    }

    // student viewing alumni
    if (user?.role === "student" && profile.role === "alumni") {
      if (mentorship?.status === "pending")
        return <span className="text-yellow-600 text-sm">Request Pending</span>;

      if (mentorship?.status === "accepted")
        return <span className="text-green-600 text-sm">Mentorship Active</span>;

      if (mentorship?.status === "rejected")
        return <span className="text-red-500 text-sm">Request Rejected</span>;

      return (
        <button
          onClick={sendRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Request Mentorship
        </button>
      );
    }

    // alumni viewing student
    if (user?.role === "alumni" && profile.role === "student") {
      return (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Start Chat
        </button>
      );
    }

    return null;
  };

  /* ---------- states ---------- */

  if (loading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-gray-500">User not found</p>
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* HERO HEADER (UNCHANGED UI) */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
            {initial}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.username}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 capitalize">
                {profile.role}
              </span>

              <span className={`text-xs flex items-center gap-1 ${profile.online ? "text-green-600" : "text-gray-500"}`}>
                <FiClock size={12} />
                {statusLabel}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {profile.email}
            </p>
          </div>

          {/* NEW ROLE ACTION BUTTON */}
          {renderActionButton()}
        </div>
      </div>

      {/* rest of YOUR UI unchanged */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-800">
            {profile.skills?.length || 0}
          </p>
          <p className="text-xs text-gray-500">Skills</p>
        </div>

        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-800">
            {profile.interests?.length || 0}
          </p>
          <p className="text-xs text-gray-500">Interests</p>
        </div>

        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-800 capitalize">
            {profile.role}
          </p>
          <p className="text-xs text-gray-500">Role</p>
        </div>
      </div>

      {/* skills */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
          <FiStar className="text-blue-600" />
          Skills
        </h3>

        {profile.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No skills added</p>
        )}
      </div>

      {/* interests */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
          <FiTarget className="text-blue-600" />
          Interests
        </h3>

        {profile.interests?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No interests added</p>
        )}
      </div>

      {profile._id !== user?.id && (
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <button
            onClick={handleBlock}
            disabled={blocking}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm transition"
          >
            <FiShield />
            {blocking ? "Blocking..." : "Block User"}
          </button>
        </div>
      )}
    </div>
  );
}