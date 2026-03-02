import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  FiMail,
  FiUser,
  FiAward,
  FiEdit,
  FiTrendingUp,
} from "react-icons/fi";

/* ===============================
   Skeleton Loader (SPA style)
=============================== */
function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-pulse">
      <div className="rounded-2xl border border-slate-200 bg-white h-40" />
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white h-24" />
        <div className="rounded-xl border border-slate-200 bg-white h-24" />
        <div className="rounded-xl border border-slate-200 bg-white h-24" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white h-28" />
      <div className="rounded-xl border border-slate-200 bg-white h-28" />
    </div>
  );
}

export default function MyProfile() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <ProfileSkeleton />;
  if (!user) return null;

  const completion = useMemo(() => {
    let score = 0;
    if (user.username) score += 25;
    if (user.email) score += 25;
    if (user.skills?.length) score += 25;
    if (user.interests?.length) score += 25;
    return score;
  }, [user]);

  const initial = user.username?.[0]?.toUpperCase() || "U";

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ===============================
          HEADER CARD
      =============================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          {/* LEFT INFO */}
          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              {initial}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FiUser className="text-slate-500" />
                {user.username}
              </h1>

              <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                <FiMail />
                {user.email}
              </p>

              <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 capitalize font-medium">
                {user.role}
              </span>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <Link
            to="/dashboard/profile-setup"
            className="
              inline-flex items-center gap-2
              bg-blue-600 text-white
              px-4 py-2 rounded-lg
              hover:bg-blue-700
              text-sm shadow-sm transition
            "
          >
            <FiEdit />
            Update Profile
          </Link>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span className="flex items-center gap-2">
              <FiTrendingUp />
              Profile Completion
            </span>
            <span className="font-semibold">{completion}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </section>

      {/* ===============================
          QUICK STATS
      =============================== */}
      <section className="grid grid-cols-3 gap-3">

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">
            {user.skills?.length || 0}
          </p>
          <p className="text-xs text-slate-500 flex justify-center items-center gap-1">
            <FiAward /> Skills
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">
            {user.interests?.length || 0}
          </p>
          <p className="text-xs text-slate-500">Interests</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800 capitalize">
            {user.role}
          </p>
          <p className="text-xs text-slate-500">Role</p>
        </div>

      </section>

      {/* ===============================
          SKILLS CARD
      =============================== */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3">Skills</h2>

        {user.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No skills added yet</p>
        )}
      </section>

      {/* ===============================
          INTERESTS CARD
      =============================== */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3">Interests</h2>

        {user.interests?.length ? (
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-600"
              >
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No interests added yet</p>
        )}
      </section>

    </div>
  );
}