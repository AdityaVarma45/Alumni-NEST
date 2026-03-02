import { ExternalLink, Bookmark, MapPin } from "lucide-react";

const typeStyles = {
  internship: "bg-blue-50 text-blue-600",
  job: "bg-green-50 text-green-600",
  referral: "bg-purple-50 text-purple-600",
  guidance: "bg-yellow-50 text-yellow-700",
  hackathon: "bg-pink-50 text-pink-600",
  freelance: "bg-indigo-50 text-indigo-600",
};

/* safe time formatter */
const timeAgo = (date) => {
  if (!date) return "";

  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
};

export default function OpportunityCard({ opportunity }) {
  if (!opportunity) return null;

  const typeClass =
    typeStyles[opportunity.type] ||
    "bg-slate-100 text-slate-600";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {opportunity.title || "Opportunity"}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {opportunity.company || "Company"}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full capitalize ${typeClass}`}
        >
          {opportunity.type || "general"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mt-3 line-clamp-3">
        {opportunity.description || "No description"}
      </p>

      {/* Skills */}
      {Array.isArray(opportunity.skills) &&
        opportunity.skills.length > 0 && (
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

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <MapPin size={13} />
          {opportunity.location || "Remote"} • {timeAgo(opportunity.createdAt)}
        </div>

        <div className="flex items-center gap-2">

          <button
            className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
          >
            <Bookmark size={15} />
          </button>

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

      {/* Poster */}
      <p className="text-xs text-slate-400 mt-3">
        Posted by {opportunity.postedBy?.username || "Alumni"}
      </p>
    </div>
  );
}