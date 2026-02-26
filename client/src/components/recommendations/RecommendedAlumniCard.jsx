import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "../../api/axios";

// helper to show last seen text
const getActivityLabel = (alumni) => {
  if (alumni.online) return "Online";

  if (!alumni.lastSeen) return "Offline";

  const diff =
    (Date.now() - new Date(alumni.lastSeen)) / 1000;

  if (diff < 60) return "Last seen just now";
  if (diff < 3600)
    return `Last seen ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)
    return `Last seen ${Math.floor(diff / 3600)}h ago`;

  return "Last seen recently";
};

export default function RecommendedAlumniCard({ alumni }) {
  const [status, setStatus] = useState(
    alumni.mentorshipStatus || null
  );

  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    try {
      setLoading(true);

      await axios.post("/mentorship/request", {
        alumniId: alumni._id,
      });

      setStatus("pending");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activity = getActivityLabel(alumni);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
      {/* top row */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          {alumni.username}
        </h3>

        <span className="text-sm font-medium text-blue-600">
          {alumni.matchScore}% match
        </span>
      </div>

      {/* presence */}
      <div className="mt-1 flex items-center gap-2 text-xs">
        <span
          className={`w-2 h-2 rounded-full ${
            alumni.online ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        <span className="text-gray-500">{activity}</span>
      </div>

      {/* common skills */}
      <p className="text-sm text-gray-500 mt-2">
        Shared skills:{" "}
        {alumni.commonSkills?.length
          ? alumni.commonSkills.join(", ")
          : "No common skills"}
      </p>

      {/* action section */}
      <div className="mt-3">
        {!status && (
          <button
            onClick={handleRequest}
            disabled={loading}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Request Mentorship"}
          </button>
        )}

        {status === "pending" && (
          <span className="text-sm text-gray-500">
            Request Pending
          </span>
        )}

        {status === "accepted" && (
          <Link
            to={`/dashboard/chat/${alumni.conversationId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Start Chat
          </Link>
        )}
      </div>
    </div>
  );
}