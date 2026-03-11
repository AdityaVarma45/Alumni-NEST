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
  if (!date) return "";

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
    opportunity.postedBy?._id?.toString() === user?.id ||
    user?.role === "admin";

  return (
    <div
      className="
      bg-white border border-slate-200
      rounded-2xl p-4 sm:p-5
      shadow-sm
      hover:shadow-md hover:-translate-y-[1px]
      transition
      "
    >

      {/* top */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">
            {opportunity.title}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {opportunity.company}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full capitalize w-fit ${typeClass}`}
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
              className="
              text-xs
              px-2 py-1
              rounded-full
              bg-slate-100
              text-slate-700
              border border-slate-200
              "
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <MapPin size={13} />
          {opportunity.location || "Remote"} •{" "}
          {timeAgo(opportunity.createdAt)}
        </div>

        <div className="flex items-center gap-2 flex-wrap">

          {/* SAVE */}
          <button
            onClick={() => onSave?.(opportunity._id)}
            className={`
              h-8 w-8 rounded-lg border flex items-center justify-center
              transition
              ${
                opportunity.isSaved
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200 hover:bg-slate-50"
              }
            `}
          >
            <Bookmark size={15} />
          </button>

          {/* EDIT */}
          {isOwner && (
            <button
              onClick={() =>
                navigate(`/dashboard/opportunities/edit/${opportunity._id}`)
              }
              className="
                h-8 w-8 rounded-lg
                border border-blue-200 text-blue-600
                hover:bg-blue-50
                flex items-center justify-center
                transition
              "
            >
              <Pencil size={15} />
            </button>
          )}

          {/* DELETE */}
          {isOwner && (
            <button
              onClick={() => onDelete?.(opportunity._id)}
              className="
                h-8 w-8 rounded-lg
                border border-red-200 text-red-500
                hover:bg-red-50
                flex items-center justify-center
                transition
              "
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
              className="
                inline-flex items-center gap-1
                text-sm
                bg-gradient-to-r from-blue-600 to-indigo-600
                text-white
                px-3 py-1.5
                rounded-lg
                hover:opacity-90
                transition
              "
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