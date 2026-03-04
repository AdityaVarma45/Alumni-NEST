import RecommendedAlumniCard from "./RecommendedAlumniCard";

export default function RecommendedAlumniSection({
  alumni,
  loading,
}) {
  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Loading recommendations...
      </p>
    );
  }

  if (!Array.isArray(alumni) || alumni.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No alumni recommendations available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {alumni.map((item) => (
        <RecommendedAlumniCard
          key={item._id}
          alumni={item}
        />
      ))}
    </div>
  );
}