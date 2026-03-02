import { useEffect, useState } from "react";
import axios from "../api/axios";
import OpportunityCard from "../components/opportunity/OpportunityCard";

import { Briefcase } from "lucide-react";

/* skeleton */
function OpportunitySkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="h-4 w-1/3 bg-slate-200 rounded mb-3" />
      <div className="h-3 w-2/3 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-1/2 bg-slate-200 rounded" />
    </div>
  );
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  /* fetch feed */
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get("/opportunities");
        setOpportunities(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase size={18} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Opportunities Feed
            </h1>
            <p className="text-sm text-slate-500">
              Alumni opportunities for students 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">

        {loading && (
          <>
            <OpportunitySkeleton />
            <OpportunitySkeleton />
            <OpportunitySkeleton />
          </>
        )}

        {!loading && opportunities.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <p className="text-slate-500 text-sm">
              No opportunities yet
            </p>
          </div>
        )}

        {!loading &&
          opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
            />
          ))}
      </div>
    </div>
  );
}