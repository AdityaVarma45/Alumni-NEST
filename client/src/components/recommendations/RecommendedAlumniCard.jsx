import { Link } from "react-router-dom";

/*
  Single recommendation card
*/

export default function RecommendedAlumniCard({ alumni }) {
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

      {/* common skills */}
      <p className="text-sm text-gray-500 mt-1">
        Shared skills:{" "}
        {alumni.commonSkills?.length
          ? alumni.commonSkills.join(", ")
          : "No common skills"}
      </p>

      {/* actions */}
      <div className="mt-3">
        <Link
          to={`/dashboard/chat/${alumni.conversationId || ""}`}
          className="text-sm text-blue-600 hover:underline"
        >
          Start Chat
        </Link>
      </div>
    </div>
  );
}