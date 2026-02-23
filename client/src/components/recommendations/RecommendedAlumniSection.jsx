import RecommendedAlumniCard from "./RecommendedAlumniCard";

/*
  Section wrapper
  Handles empty state + layout
*/

export default function RecommendedAlumniSection({
  alumni = [],
}) {
  if (!alumni.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
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