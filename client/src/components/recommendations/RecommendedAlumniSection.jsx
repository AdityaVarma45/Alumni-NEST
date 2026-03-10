import { Link } from "react-router-dom";
import RecommendedAlumniCard from "./RecommendedAlumniCard";
import { GraduationCap, ArrowRight } from "lucide-react";

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
    return null;
  }

  const visibleAlumni = alumni.slice(0, 3);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap size={18} className="text-slate-500" />
        <h2 className="font-semibold text-slate-800">
          Recommended Alumni
        </h2>
      </div>

      {/* Cards */}
      <div className="grid gap-3">
        {visibleAlumni.map((item) => (
          <Link
            key={item._id}
            to={`/dashboard/users/${item._id}`}
            className="block"
          >
            <RecommendedAlumniCard alumni={item} />
          </Link>
        ))}
      </div>

      {/* Footer button */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <Link
          to="/dashboard/users"
          className="
            flex items-center justify-center gap-2
            w-full
            text-sm font-medium
            text-blue-600
            bg-blue-50
            hover:bg-blue-100
            rounded-xl
            py-2.5
            transition
          "
        >
          Browse all mentors
          <ArrowRight size={16} />
        </Link>
      </div>

    </section>
  );
}