import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MentorshipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* fetch requests */
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

  /* respond action */
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

  const getStatusStyle = (status) => {
    if (status === "accepted")
      return "bg-green-50 text-green-600";
    if (status === "rejected")
      return "bg-red-50 text-red-600";
    return "bg-yellow-50 text-yellow-600";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">
          Mentorship Requests
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review and manage incoming mentorship requests.
        </p>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
            >
              <div className="h-4 w-1/3 rounded bg-slate-200 mb-3" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && requests.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            No mentorship requests yet
          </p>
        </div>
      )}

      {/* LIST */}
      {!loading && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>
                  <p className="font-semibold text-slate-800">
                    {req.student?.username ||
                      req.alumni?.username}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Status:
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full capitalize ${getStatusStyle(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </p>
                </div>

                {/* actions */}
                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        respond(req._id, "accepted")
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition shadow-sm"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        respond(req._id, "rejected")
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition shadow-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}