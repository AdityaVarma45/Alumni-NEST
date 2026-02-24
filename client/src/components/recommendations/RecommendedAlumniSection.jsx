import RecommendedAlumniCard from "./RecommendedAlumniCard";

/*
  Section wrapper
  shows recommendation list
*/

export default function RecommendedAlumniSection({
  alumni = [],
}) {
  if (!alumni.length) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Recommended Alumni
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