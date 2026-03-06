import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MentorshipOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("/mentorship");

        setOffers(
          res.data.filter((m) => m.initiatedBy === "alumni")
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const respond = async (id, status) => {
    try {
      await axios.put(`/mentorship/respond/${id}`, {
        status,
      });

      setOffers((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error(err);
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">
          Mentorship Offers
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Alumni offering mentorship to you.
        </p>
      </section>

      {loading && <p>Loading...</p>}

      {!loading && offers.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          No mentorship offers yet
        </div>
      )}

      {!loading && offers.length > 0 && (
        <div className="space-y-3">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="font-semibold text-slate-800">
                    {offer.alumni?.username}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                      offer.status
                    )}`}
                  >
                    {offer.status}
                  </span>
                </div>

                {offer.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        respond(offer._id, "accepted")
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        respond(offer._id, "rejected")
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
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