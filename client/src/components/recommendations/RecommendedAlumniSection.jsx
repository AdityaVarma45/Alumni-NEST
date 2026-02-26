import RecommendedAlumniCard from "./RecommendedAlumniCard";

/*
  Recommendation section
  - receives alumni array
  - safely handles empty or invalid data
*/

export default function RecommendedAlumniSection({ alumni }) {
  // safety check (prevents map errors)
  if (!Array.isArray(alumni) || alumni.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
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