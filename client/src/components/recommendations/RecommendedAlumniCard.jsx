import { Link } from "react-router-dom";

/*
  Single Alumni Card
  - shows match score
  - shared skills
  - quick connect action
*/

export default function RecommendedAlumniCard({ alumni }) {
  return (
    <div
      className="
        bg-white rounded-2xl p-4
        shadow-sm hover:shadow-md
        transition-all duration-200
        hover:scale-[1.01]
      "
    >
      {/* top row */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          {alumni.username}
        </h3>

        {/* match badge */}
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
          {alumni.matchScore}% Match
        </span>
      </div>

      {/* common skills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {alumni.commonSkills?.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="
              text-xs bg-gray-100 text-gray-700
              px-2 py-1 rounded-full
            "
          >
            {skill}
          </span>
        ))}
      </div>

      {/* action button */}
      <Link
        to={`/dashboard/chat/${alumni._id}`}
        className="
          mt-4 inline-block
          bg-blue-600 text-white
          text-sm px-3 py-1.5
          rounded-lg hover:bg-blue-700
          transition
        "
      >
        Connect
      </Link>
    </div>
  );
}