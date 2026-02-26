import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getMentorshipRequests,
  respondMentorship,
} from "../services/mentorshipService";

export default function MentorshipRequests() {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getMentorshipRequests();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResponse = async (id, status) => {
    try {
      await respondMentorship(id, status);

      // update UI instantly
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Mentorship Requests
      </h1>

      {!requests.length && (
        <p className="text-gray-500">No requests yet</p>
      )}

      <div className="space-y-3">
        {requests.map((req) => {
          const student = req.student || req.alumni;

          return (
            <div
              key={req._id}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-medium">
                {student?.username}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Status: {req.status}
              </p>

              {/* alumni actions */}
              {user?.role === "alumni" &&
                req.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() =>
                        handleResponse(req._id, "accepted")
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleResponse(req._id, "rejected")
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}