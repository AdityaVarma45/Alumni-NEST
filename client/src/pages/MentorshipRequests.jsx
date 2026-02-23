import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function MentorshipRequests() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/mentorship");
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (id, status) => {
    try {
      await axios.put(`/mentorship/respond/${id}`, {
        status,
      });

      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6">
        Mentorship Requests
      </h2>

      {requests.length === 0 && (
        <p className="text-gray-500">No requests found</p>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white p-4 rounded shadow"
          >
            {user.role === "alumni" ? (
              <>
                <p>
                  <strong>{req.student?.username}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  {req.student?.email}
                </p>

                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleRespond(req._id, "accepted")}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleRespond(req._id, "rejected")}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>{req.alumni?.username}</strong>
                </p>

                <p className="mt-2">
                  Status:{" "}
                  <span className="font-semibold">
                    {req.status}
                  </span>
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
