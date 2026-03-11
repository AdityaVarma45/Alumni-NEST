import { Link } from "react-router-dom";
import { useRecommendedStudents } from "../../hooks/useRecommendedStudents";
import RecommendedStudentCard from "./RecommendedStudentCard";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Users, ArrowRight } from "lucide-react";

/* skeleton */
function CardSkeleton() {
  return (
    <div className="border border-slate-200 rounded-2xl p-4 bg-white animate-pulse">
      <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
      <div className="h-3 w-24 bg-slate-200 rounded mb-3"></div>
      <div className="h-6 w-24 bg-slate-200 rounded"></div>
    </div>
  );
}

export default function RecommendedStudentsSection() {
  const { students, loading } = useRecommendedStudents();
  const { conversations } = useContext(ChatContext);

  if (loading) {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Users size={18} className="text-slate-400" />
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
        </div>

        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </section>
    );
  }

  if (!Array.isArray(students) || students.length === 0) {
    return null;
  }

  const visibleStudents = students.slice(0, 3);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Users size={18} className="text-indigo-600" />
        <h2 className="font-semibold text-slate-800">
          Students You Can Mentor
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3">
        {visibleStudents.map((student) => (
          <Link
            key={student._id}
            to={`/dashboard/users/${student._id}`}
            className="block"
          >
            <RecommendedStudentCard
              student={student}
              conversations={conversations}
            />
          </Link>
        ))}
      </div>

      {/* Footer CTA */}
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
          Browse all students
          <ArrowRight size={16} />
        </Link>
      </div>

    </section>
  );
}