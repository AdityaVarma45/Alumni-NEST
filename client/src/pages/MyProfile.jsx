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

/* Skeleton */

function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse px-4">
      <div className="rounded-2xl border border-slate-200 bg-white h-44 shadow-sm" />

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white h-24 shadow-sm" />
        <div className="rounded-xl border border-slate-200 bg-white h-24 shadow-sm" />
        <div className="rounded-xl border border-slate-200 bg-white h-24 shadow-sm" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white h-32 shadow-sm" />
      <div className="rounded-xl border border-slate-200 bg-white h-32 shadow-sm" />
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
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6">

      {/* HEADER */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md ring-2 ring-white">
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

              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 capitalize font-medium">
                {user.role}
              </span>

            </div>

          </div>

          <Link
            to="/dashboard/profile-setup"
            className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition text-sm font-medium"
          >
            <FiEdit />
            Update Profile
          </Link>

        </div>

        {/* PROFILE COMPLETION */}

        <div className="mt-6">

          <div className="flex justify-between text-sm text-slate-600 mb-2">

            <span className="flex items-center gap-2">
              <FiTrendingUp />
              Profile Completion
            </span>

            <span className="font-semibold">{completion}%</span>

          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />

          </div>

        </div>

      </section>

      {/* QUICK STATS */}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition">

          <p className="text-2xl font-bold text-slate-800">
            {user.skills?.length || 0}
          </p>

          <p className="text-xs text-slate-500 flex justify-center items-center gap-1 mt-1">
            <FiAward />
            Skills
          </p>

        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition">

          <p className="text-2xl font-bold text-slate-800">
            {user.interests?.length || 0}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Interests
          </p>

        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition">

          <p className="text-2xl font-bold text-slate-800 capitalize">
            {user.role}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Role
          </p>

        </div>

      </section>

      {/* SKILLS */}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="font-semibold text-slate-800 mb-4">
          Skills
        </h2>

        {user.skills?.length ? (

          <div className="flex flex-wrap gap-2">

            {user.skills.map((skill) => (

              <span
                key={skill}
                className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                {skill}
              </span>

            ))}

          </div>

        ) : (

          <p className="text-sm text-slate-500">
            No skills added yet
          </p>

        )}

      </section>

      {/* INTERESTS */}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="font-semibold text-slate-800 mb-4">
          Interests
        </h2>

        {user.interests?.length ? (

          <div className="flex flex-wrap gap-2">

            {user.interests.map((interest) => (

              <span
                key={interest}
                className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              >
                {interest}
              </span>

            ))}

          </div>

        ) : (

          <p className="text-sm text-slate-500">
            No interests added yet
          </p>

        )}

      </section>

    </div>
  );
}