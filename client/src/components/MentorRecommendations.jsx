export default function MentorRecommendations({ mentors = [] }) {
  if (!mentors.length) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">

      {/* Header */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        🔥 Recommended Mentors For You
      </h2>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-3">

        {mentors.slice(0, 4).map((mentor) => (
          <div
            key={mentor._id}
            className="
              border border-slate-200
              rounded-xl p-4
              hover:bg-slate-50 hover:shadow-sm
              transition
            "
          >

            {/* Name */}
            <h3 className="font-semibold text-slate-800">
              {mentor.username}
            </h3>

            {/* Match */}
            <p className="text-xs text-slate-500 mt-1">
              Match Score:{" "}
              <span className="font-medium text-blue-600">
                {mentor.matchScore}%
              </span>
            </p>

            {/* Skills */}
            {mentor.commonSkills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {mentor.commonSkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="
                      text-xs
                      bg-slate-100 text-slate-700
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

          </div>
        ))}

      </div>

    </section>
  );
}