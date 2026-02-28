import RecommendedAlumniCard from "./RecommendedAlumniCard";

export default function RecommendedAlumniSection({
  alumni,
  loading,
}) {
  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Recommended Alumni
        </h2>

        <p className="text-sm text-gray-500">
          Loading recommendations...
        </p>
      </div>
    );
  }

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