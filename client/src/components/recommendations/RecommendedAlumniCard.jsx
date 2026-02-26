import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useState, useContext, useEffect, useMemo } from "react";
import { ChatContext } from "../../context/ChatContext";

/* small helper */
const getLastSeenLabel = (date) => {
  if (!date) return "Offline";

  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return "Active just now";
  if (diff < 3600) return `Active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return "Active today";

  return "Offline";
};

export default function RecommendedAlumniCard({ alumni }) {
  const { mentorshipUpdates, conversations } = useContext(ChatContext);

  const [status, setStatus] = useState(alumni.mentorshipStatus);
  const [conversationId, setConversationId] = useState(
    alumni.conversationId || null,
  );

  /* ---------------------------------------
     detect existing conversation
     (conversation intelligence)
  --------------------------------------- */
  const existingConversation = useMemo(() => {
    return conversations.find((conv) =>
      conv.participants?.some((p) => p._id === alumni._id),
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

      // normal success
      setStatus("pending");
    } catch (err) {
      // backend says request already exists
      if (err.response?.data?.message === "Mentorship already exists") {
        const existing = err.response.data.mentorship;

        // sync UI with backend state
        setStatus(existing.status);

        return;
      }

      console.error(err);
    }
  };
  /* ---------------------------------------
     ACTION BUTTON ENGINE
  --------------------------------------- */
  const renderActionButton = () => {
    // PRIORITY 1 → already chatting
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

    // PRIORITY 2 → mentorship accepted
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

    // PRIORITY 3 → pending
    if (status === "pending") {
      return (
        <span className="text-sm text-yellow-600 font-medium">
          Request Pending
        </span>
      );
    }

    // PRIORITY 4 → rejected
    if (status === "rejected") {
      return <span className="text-sm text-red-500">Request Rejected</span>;
    }

    // default → request mentorship
    return (
      <button
        onClick={sendRequest}
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Request Mentorship
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      {/* top row */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{alumni.username}</h3>

        <span className="text-sm font-medium text-blue-600">
          {alumni.matchScore}% match
        </span>
      </div>

      {/* presence */}
      <p className="text-xs mt-1">
        {isOnline ? (
          <span className="text-green-600">Online</span>
        ) : (
          <span className="text-gray-500">
            {getLastSeenLabel(alumni.lastSeen)}
          </span>
        )}
      </p>

      {/* skills */}
      <p className="text-sm text-gray-500 mt-2">
        Shared skills:{" "}
        {alumni.commonSkills?.length
          ? alumni.commonSkills.join(", ")
          : "No common skills"}
      </p>

      {/* action */}
      <div className="mt-3">{renderActionButton()}</div>
    </div>
  );
}
