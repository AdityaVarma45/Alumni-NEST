export default function MentorRecommendations({ mentors }) {
  if (!mentors?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">
        🔥 Recommended Mentors For You
      </h2>

      <div className="grid md:grid-cols-2 gap-3">
        {mentors.slice(0, 4).map((mentor) => (
          <div
            key={mentor._id}
            className="
              bg-white p-4 rounded-2xl
              shadow-sm hover:shadow-md
              transition-all
            "
          >
            <h3 className="font-semibold">
              {mentor.username}
            </h3>

            <p className="text-sm text-gray-500">
              Match Score: {mentor.matchScore}%
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {mentor.commonSkills?.map((skill) => (
                <span
                  key={skill}
                  className="
                    text-xs bg-blue-100 text-blue-600
                    px-2 py-1 rounded-full
                  "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}