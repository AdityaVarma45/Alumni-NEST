import {
  ExternalLink,
  Bookmark,
  MapPin,
  Trash2,
  Pencil,
} from "lucide-react";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

/* badge colors */
const typeStyles = {
  internship: "bg-blue-50 text-blue-600",
  job: "bg-green-50 text-green-600",
  referral: "bg-purple-50 text-purple-600",
  guidance: "bg-yellow-50 text-yellow-700",
  hackathon: "bg-pink-50 text-pink-600",
  freelance: "bg-indigo-50 text-indigo-600",
};

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
};

export default function OpportunityCard({
  opportunity,
  onSave,
  onDelete,
}) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const typeClass =
    typeStyles[opportunity.type] ||
    "bg-slate-100 text-slate-600";

  const isOwner =
    opportunity.postedBy?._id === user?.id ||
    user?.role === "admin";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      {/* top */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {opportunity.title}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {opportunity.company}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full capitalize ${typeClass}`}
        >
          {opportunity.type}
        </span>
      </div>

      {/* description */}
      <p className="text-sm text-slate-600 mt-3 line-clamp-3">
        {opportunity.description}
      </p>

      {/* skills */}
      {opportunity.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {opportunity.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between mt-4">

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <MapPin size={13} />
          {opportunity.location || "Remote"} •{" "}
          {timeAgo(opportunity.createdAt)}
        </div>

        <div className="flex items-center gap-2">

          {/* SAVE */}
          <button
            onClick={() => onSave?.(opportunity._id)}
            className={`h-8 w-8 rounded-lg border flex items-center justify-center ${
              opportunity.isSaved
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Bookmark size={15} />
          </button>

          {/* EDIT */}
          {isOwner && (
            <button
              onClick={() =>
                navigate(`/dashboard/opportunities/edit/${opportunity._id}`)
              }
              className="h-8 w-8 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
            >
              <Pencil size={15} />
            </button>
          )}

          {/* DELETE */}
          {isOwner && (
            <button
              onClick={() => onDelete?.(opportunity._id)}
              className="h-8 w-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
            >
              <Trash2 size={15} />
            </button>
          )}

          {/* APPLY */}
          {opportunity.applyLink && (
            <a
              href={opportunity.applyLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              Apply
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* author */}
      <p className="text-xs text-slate-400 mt-3">
        Posted by {opportunity.postedBy?.username || "Alumni"}
      </p>

    </div>
  );
}