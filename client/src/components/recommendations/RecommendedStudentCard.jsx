import axios from "../../api/axios";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

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
  if (score >= 80)
    return { label: "Excellent match", color: "text-green-600 bg-green-50" };

  if (score >= 60)
    return { label: "Strong match", color: "text-blue-600 bg-blue-50" };

  if (score >= 40)
    return { label: "Good match", color: "text-amber-600 bg-amber-50" };

  return { label: "Possible match", color: "text-slate-500 bg-slate-100" };
};

export default function RecommendedStudentCard({ student, conversations = [] }) {
  const [status, setStatus] = useState(student.mentorshipStatus);
  const [conversationId] = useState(student.conversationId || null);

  const matchInfo = getMatchLabel(student.matchScore);

  const existingConversation = useMemo(() => {
    return conversations.find((conv) =>
      conv.participants?.some((p) => p._id === student._id)
    );
  }, [conversations, student]);

  const isOnline = useMemo(() => {
    return existingConversation?.online || false;
  }, [existingConversation]);

  const offerMentorship = async () => {
    try {
      await axios.post("/mentorship/offer", {
        studentId: student._id,
        message: "I'd like to mentor you.",
      });

      setStatus("pending");
    } catch (error) {
      console.error(error);
    }
  };

  const renderAction = () => {
    if (existingConversation) {
      return (
        <Link
          to={`/dashboard/chat/${existingConversation._id}`}
          className="text-sm font-medium text-green-600 hover:underline"
        >
          Continue Chat
        </Link>
      );
    }

    if (status === "accepted") {
      return (
        <Link
          to={`/dashboard/chat/${conversationId}`}
          className="text-sm font-medium text-green-600 hover:underline"
        >
          Start Chat
        </Link>
      );
    }

    if (status === "pending") {
      return (
        <span className="text-sm text-yellow-600 font-medium">
          Offer Sent
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="text-sm text-red-500">
          Offer Rejected
        </span>
      );
    }

    return (
      <button
        onClick={offerMentorship}
        className="text-sm font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
      >
        Offer Mentorship
      </button>
    );
  };

  return (
    <div
      className="
        bg-white border border-slate-200
        rounded-2xl p-4
        shadow-sm
        hover:shadow-lg hover:-translate-y-0.5
        transition-all duration-200
      "
    >

      {/* HEADER */}
      <div className="flex items-start justify-between">

        <div>

          <h3 className="font-semibold text-slate-800">
            {student.username}
          </h3>

          <p className="text-xs mt-1 flex items-center gap-2">

            {isOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>

                <span className="text-green-600 font-medium">
                  Online
                </span>
              </>
            ) : (
              <span className="text-slate-500">
                {getLastSeenLabel(student.lastSeen)}
              </span>
            )}

          </p>

        </div>

        <div className="flex flex-col items-end gap-1">

          <span className="text-xs font-semibold text-slate-700">
            {student.matchScore}% match
          </span>

          <span
            className={`text-xs px-2 py-0.5 rounded-md font-medium ${matchInfo.color}`}
          >
            {matchInfo.label}
          </span>

        </div>

      </div>

      <p className="text-xs text-slate-500 mt-3">
        Skills aligned with your expertise
      </p>

      {student.commonSkills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">

          {student.commonSkills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="
                text-xs
                bg-slate-100
                text-slate-700
                px-2 py-1
                rounded-md
                border border-slate-200
              "
            >
              {skill}
            </span>
          ))}

        </div>
      )}

      <div className="mt-4">
        {renderAction()}
      </div>

    </div>
  );
}