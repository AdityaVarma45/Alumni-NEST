import { Link } from "react-router-dom";
import { useRecommendedStudents } from "../../hooks/useRecommendedStudents";
import RecommendedStudentCard from "./RecommendedStudentCard";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Users, ArrowRight } from "lucide-react";

export default function RecommendedStudentsSection() {
  const { students, loading } = useRecommendedStudents();
  const { conversations } = useContext(ChatContext);

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading students...
      </p>
    );
  }

  if (!students.length) return null;

  const visibleStudents = students.slice(0, 3);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-slate-500" />
        <h2 className="font-semibold text-slate-800">
          Students You Can Mentor
        </h2>
      </div>

      {/* Cards */}
      <div className="grid gap-3">
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
          Browse all students
          <ArrowRight size={16} />
        </Link>
      </div>

    </section>
  );
}