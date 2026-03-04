import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useState, useContext, useEffect, useMemo } from "react";
import { ChatContext } from "../../context/ChatContext";

/* last seen helper */
const getLastSeenLabel = (date) => {
  if (!date) return "Offline";

  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return "Active now";
  if (diff < 3600) return `Active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return "Active today";

  return "Offline";
};

/* match quality helper */
const getMatchLabel = (score) => {
  if (score >= 80) {
    return { label: "Excellent match", color: "text-green-600 bg-green-50" };
  }

  if (score >= 60) {
    return { label: "Strong match", color: "text-blue-600 bg-blue-50" };
  }

  if (score >= 40) {
    return { label: "Good match", color: "text-amber-600 bg-amber-50" };
  }

  return { label: "Possible match", color: "text-slate-500 bg-slate-100" };
};

export default function RecommendedAlumniCard({ alumni }) {
  const { mentorshipUpdates, conversations } = useContext(ChatContext);

  const [status, setStatus] = useState(alumni.mentorshipStatus);
  const [conversationId, setConversationId] = useState(
    alumni.conversationId || null
  );

  const matchInfo = getMatchLabel(alumni.matchScore);

  /* detect existing conversation */
  const existingConversation = useMemo(() => {
    return conversations.find((conv) =>
      conv.participants?.some((p) => p._id === alumni._id)
    );
  }, [conversations, alumni._id]);

  /* online detection */
  const isOnline = useMemo(() => {
    if (!existingConversation) return false;
    return existingConversation.online;
  }, [existingConversation]);

  /* mentorship live updates */
  useEffect(() => {
    const update = mentorshipUpdates?.[alumni._id];

    if (update) {
      setStatus(update.status);
      setConversationId(update.conversationId);
    }
  }, [mentorshipUpdates, alumni._id]);

  /* send mentorship request */
  const sendRequest = async () => {
    try {
      await axios.post("/mentorship/request", {
        alumniId: alumni._id,
        message: "I would like mentorship",
      });

      setStatus("pending");
    } catch (err) {
      if (err.response?.data?.message === "Mentorship already exists") {
        const existing = err.response.data.mentorship;
        setStatus(existing.status);
        return;
      }

      console.error(err);
    }
  };

  /* action button engine */
  const renderActionButton = () => {
    if (existingConversation) {
      return (
        <Link
          to={`/dashboard/chat/${existingConversation._id}`}
          className="text-sm text-green-600 hover:underline font-medium"
        >
          Continue Chat
        </Link>
      );
    }

    if (status === "accepted") {
      return (
        <Link
          to={`/dashboard/chat/${conversationId}`}
          className="text-sm text-green-600 hover:underline font-medium"
        >
          Start Chat
        </Link>
      );
    }

    if (status === "pending") {
      return (
        <span className="text-sm text-yellow-600 font-medium">
          Request Pending
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="text-sm text-red-500">
          Request Rejected
        </span>
      );
    }

    return (
      <button
        onClick={sendRequest}
        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
      >
        Request Mentorship
      </button>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h3 className="font-semibold text-slate-800">
            {alumni.username}
          </h3>

          <p className="text-xs mt-1">
            {isOnline ? (
              <span className="text-green-600">Online</span>
            ) : (
              <span className="text-slate-500">
                {getLastSeenLabel(alumni.lastSeen)}
              </span>
            )}
          </p>
        </div>

        {/* Match indicator */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-semibold text-slate-700">
            {alumni.matchScore}% match
          </span>

          <span
            className={`text-xs px-2 py-0.5 rounded-md ${matchInfo.color}`}
          >
            {matchInfo.label}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs text-slate-500 mt-3">
        You share expertise in these areas
      </p>

      {/* Skills */}
      {alumni.commonSkills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {alumni.commonSkills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="mt-4">
        {renderActionButton()}
      </div>
    </div>
  );
}