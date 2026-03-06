import { useRecommendedStudents } from "../../hooks/useRecommendedStudents";
import RecommendedStudentCard from "./RecommendedStudentCard";

export default function RecommendedStudentsSection() {
  const { students, loading } = useRecommendedStudents();

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading students...
      </p>
    );
  }

  if (!students.length) {
    return null;
  }

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="font-semibold text-slate-800 mb-4">
        Students You Can Mentor
      </h2>

      <div className="grid gap-3">
        {students.map((student) => (
          <RecommendedStudentCard
            key={student._id}
            student={student}
          />
        ))}
      </div>
    </section>
  );
}