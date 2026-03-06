import axios from "../../api/axios";
import { useState } from "react";

export default function RecommendedStudentCard({ student }) {
  const [status, setStatus] = useState(student.mentorshipStatus);

  const offerMentorship = async () => {
    try {
      await axios.post("/mentorship/offer", {
        studentId: student._id,
        message: "I'd like to mentor you.",
      });

      setStatus("pending");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition">

      <div className="flex justify-between items-start">

        <div>
          <h3 className="font-semibold text-slate-800">
            {student.username}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Student aligned with your expertise
          </p>
        </div>

        <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
          {student.matchScore}% match
        </span>
      </div>

      {student.commonSkills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {student.commonSkills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4">

        {status === "pending" ? (
          <span className="text-sm text-yellow-600">
            Offer Sent
          </span>
        ) : (
          <button
            onClick={offerMentorship}
            className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
          >
            Offer Mentorship
          </button>
        )}

      </div>

    </div>
  );
}