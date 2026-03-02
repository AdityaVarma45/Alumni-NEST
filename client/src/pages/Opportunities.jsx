import { useEffect, useMemo, useState, useContext } from "react";
import axios from "../api/axios";
import OpportunityCard from "../components/opportunity/OpportunityCard";
import { AuthContext } from "../context/AuthContext";

import { Briefcase } from "lucide-react";

/* ===============================
   Skeleton Loader
=============================== */
function OpportunitySkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="h-4 w-1/3 bg-slate-200 rounded mb-3" />
      <div className="h-3 w-2/3 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-1/2 bg-slate-200 rounded" />
    </div>
  );
}

/* ===============================
   FILTER OPTIONS
=============================== */
const filters = [
  "all",
  "internship",
  "job",
  "referral",
  "guidance",
  "hackathon",
  "freelance",
];

export default function Opportunities() {
  const { user } = useContext(AuthContext);

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState("all");
  const [showMine, setShowMine] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  /* ===============================
     FETCH FEED
  =============================== */
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get("/opportunities");

        const data = (res.data || []).map((o) => ({
          ...o,
          isSaved: o.isSaved || false,
        }));

        setOpportunities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  /* ===============================
     SAVE / UNSAVE
  =============================== */
  const handleSave = async (id) => {
    try {
      const res = await axios.put(`/opportunities/${id}/save`);

      setOpportunities((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, isSaved: res.data.saved } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     DELETE
  =============================== */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/opportunities/${id}`);

      setOpportunities((prev) =>
        prev.filter((o) => o._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     SMART FILTERED FEED
  =============================== */
  const filteredFeed = useMemo(() => {
    let list = [...opportunities];

    if (activeFilter !== "all") {
      list = list.filter((o) => o.type === activeFilter);
    }

    /* alumni → my posts */
    if (showMine) {
      list = list.filter(
        (o) => o.postedBy?._id === user?.id
      );
    }

    /* student → saved posts */
    if (showSaved) {
      list = list.filter((o) => o.isSaved);
    }

    return list;
  }, [opportunities, activeFilter, showMine, showSaved, user]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">

          {/* left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase size={18} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Opportunities Feed
              </h1>
              <p className="text-sm text-slate-500">
                Alumni shared opportunities for students 🚀
              </p>
            </div>
          </div>

          {/* alumni post button */}
          {user?.role === "alumni" && (
            <button
              onClick={() =>
                (window.location.href =
                  "/dashboard/opportunities/create")
              }
              className="
                bg-blue-600 text-white
                px-4 py-2 rounded-xl
                text-sm font-medium
                hover:bg-blue-700
                transition-all
                shadow-sm
              "
            >
              + Post Opportunity
            </button>
          )}
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-2">

        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition ${
              activeFilter === f
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}

        {/* alumni filter */}
        {user?.role === "alumni" && (
          <button
            onClick={() => setShowMine((p) => !p)}
            className={`ml-auto px-3 py-1.5 rounded-lg text-sm transition ${
              showMine
                ? "bg-green-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {showMine ? "Showing My Posts" : "My Opportunities"}
          </button>
        )}

        {/* student filter */}
        {user?.role === "student" && (
          <button
            onClick={() => setShowSaved((p) => !p)}
            className={`ml-auto px-3 py-1.5 rounded-lg text-sm transition ${
              showSaved
                ? "bg-yellow-500 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {showSaved ? "Saved Only" : "Bookmarked"}
          </button>
        )}
      </div>

      {/* ================= FEED ================= */}
      <div className="space-y-4">

        {loading && (
          <>
            <OpportunitySkeleton />
            <OpportunitySkeleton />
            <OpportunitySkeleton />
          </>
        )}

        {!loading && filteredFeed.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-slate-500 text-sm">
              No opportunities found
            </p>
          </div>
        )}

        {!loading &&
          filteredFeed.map((opportunity) => (
            <OpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
}