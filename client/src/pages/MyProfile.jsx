import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/* skeleton loader */
function ProfileSkeleton() {
  return (
    <div className="p-6 max-w-3xl space-y-4 animate-pulse">
      <div className="bg-white border rounded-xl p-6 h-36" />
      <div className="bg-white border rounded-xl p-6 h-28" />
      <div className="bg-white border rounded-xl p-6 h-28" />
    </div>
  );
}

export default function MyProfile() {
  const { user, loading } = useContext(AuthContext);

  /* loading state */
  if (loading) return <ProfileSkeleton />;
  if (!user) return null;

  /* ===== PROFILE COMPLETION ===== */
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
    <div className="p-6 max-w-3xl space-y-6">

      {/* ===== HEADER CARD ===== */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">

          {/* avatar */}
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
            {initial}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user.username}
            </h1>

            <p className="text-gray-500">{user.email}</p>

            <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 capitalize">
              {user.role}
            </span>
          </div>
        </div>

        {/* profile completion */}
        <div className="mt-5">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Profile Completion</span>
            <span>{completion}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===== QUICK STATS ===== */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-800">
            {user.skills?.length || 0}
          </p>
          <p className="text-xs text-gray-500">Skills</p>
        </div>

        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-800">
            {user.interests?.length || 0}
          </p>
          <p className="text-xs text-gray-500">Interests</p>
        </div>

        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-800 capitalize">
            {user.role}
          </p>
          <p className="text-xs text-gray-500">Role</p>
        </div>
      </div>

      {/* ===== SKILLS ===== */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">
          Skills
        </h2>

        {user.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No skills added yet
          </p>
        )}
      </div>

      {/* ===== INTERESTS ===== */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">
          Interests
        </h2>

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
          <p className="text-sm text-gray-500">
            No interests added yet
          </p>
        )}
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">
          Profile Actions
        </h2>

        <Link
          to="/dashboard/profile-setup"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Edit Skills & Interests
        </Link>
      </div>
    </div>
  );
}