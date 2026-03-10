import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function MentorshipRequests() {
  const [studentRequests, setStudentRequests] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/mentorship");

        const studentReq = res.data.filter(
          (m) => m.initiatedBy === "student"
        );

        const alumniOffers = res.data.filter(
          (m) => m.initiatedBy === "alumni"
        );

        setStudentRequests(studentReq);
        setSentOffers(alumniOffers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const respond = async (id, status) => {
    try {
      await axios.put(`/mentorship/respond/${id}`, { status });

      setStudentRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status } : r
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const openChat = async (userId) => {
    try {
      const res = await axios.get("/chat/conversations");

      const conversation = res.data.find((c) =>
        c.participants.some((p) => p._id === userId)
      );

      if (conversation) {
        navigate(`/dashboard/chat/${conversation._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "accepted") return "bg-green-50 text-green-600";
    if (status === "rejected") return "bg-red-50 text-red-600";
    return "bg-yellow-50 text-yellow-600";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          Mentorship Requests
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Review student requests and track your mentorship offers.
        </p>
      </section>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}

      {/* STUDENT REQUESTS */}
      {!loading && studentRequests.length > 0 && (
        <section className="space-y-3">

          <h3 className="text-sm font-semibold text-slate-600">
            Student Requests
          </h3>

          {studentRequests.map((req) => (
            <div
              key={req._id}
              className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
            >

              {req.status === "accepted" && (
                <button
                  onClick={() => openChat(req.student?._id)}
                  className="absolute top-3 right-3 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Open Chat
                </button>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                <p className="font-semibold text-slate-800">
                  {req.student?.username}
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-full w-fit ${getStatusStyle(req.status)}`}
                >
                  {req.status}
                </span>

              </div>

              {req.status === "pending" && (
                <div className="flex flex-wrap gap-2 mt-3">

                  <button
                    onClick={() => respond(req._id, "accepted")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => respond(req._id, "rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>
          ))}

        </section>
      )}

      {/* SENT OFFERS */}
      {!loading && sentOffers.length > 0 && (
        <section className="space-y-3">

          <h3 className="text-sm font-semibold text-slate-600">
            Your Sent Offers
          </h3>

          {sentOffers.map((offer) => (
            <div
              key={offer._id}
              className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
            >

              {offer.status === "accepted" && (
                <button
                  onClick={() => openChat(offer.student?._id)}
                  className="absolute top-3 right-3 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Open Chat
                </button>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                <p className="font-semibold text-slate-800">
                  {offer.student?.username}
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-full w-fit ${getStatusStyle(offer.status)}`}
                >
                  {offer.status}
                </span>

              </div>

            </div>
          ))}

        </section>
      )}

    </div>
  );
}