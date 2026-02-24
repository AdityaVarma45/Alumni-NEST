import RecommendedAlumniCard from "./RecommendedAlumniCard";

/*
  Shows recommended alumni section
  Handles loading / empty state cleanly
*/

export default function RecommendedAlumniSection({
  alumni = [],
  loading = false,
  error = null,
}) {
  // loading state
  if (loading) {
    return (
      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Recommended Alumni
        </h2>

        <p className="text-sm text-gray-500">
          Loading recommendations...
        </p>
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Recommended Alumni
        </h2>

        <p className="text-sm text-red-500">
          Failed to load recommendations
        </p>
      </div>
    );
  }

  // empty state
  if (!alumni.length) {
    return (
      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Recommended Alumni
        </h2>

        <p className="text-sm text-gray-500">
          No recommendations yet.
        </p>
      </div>
    );
  }

  // normal UI
  return (
    <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Recommended Alumni 👑
      </h2>

      <div className="grid gap-3">
        {alumni.map((item) => (
          <RecommendedAlumniCard
            key={item._id}
            alumni={item}
          />
        ))}
      </div>
    </div>
  );
}