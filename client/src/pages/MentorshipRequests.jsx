import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MentorshipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH REQUESTS
  =============================== */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/mentorship");

        setRequests(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  /* ===============================
     RESPOND (ALUMNI)
  =============================== */
  const respond = async (id, status) => {
    try {
      await axios.put(`/mentorship/respond/${id}`, {
        status,
      });

      // instant UI update
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status } : r
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-5 text-gray-800">
        Mentorship Requests
      </h2>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-4 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && requests.length === 0 && (
        <p className="text-sm text-gray-500">
          No mentorship requests yet
        </p>
      )}

      {/* ================= LIST ================= */}
      {!loading && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <p className="font-semibold text-gray-800">
                {req.student?.username ||
                  req.alumni?.username}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Status:{" "}
                <span className="capitalize">
                  {req.status}
                </span>
              </p>

              {/* pending actions */}
              {req.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() =>
                      respond(req._id, "accepted")
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      respond(req._id, "rejected")
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}