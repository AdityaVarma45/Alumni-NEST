import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/${id}`);
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleBlock = async () => {
    try {
      setBlocking(true);

      await axios.post("/users/block", {
        userIdToBlock: profile._id,
      });

      alert("User blocked successfully");
      navigate("/dashboard/users");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to block");
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const statusLabel = profile.online
    ? "Online"
    : profile.lastSeen
    ? `Last seen ${new Date(profile.lastSeen).toLocaleString()}`
    : "Offline";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* ===== PROFILE HERO ===== */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-4">

          {/* avatar */}
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
            {profile.username?.charAt(0)?.toUpperCase()}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.username}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 capitalize">
                {profile.role}
              </span>

              <span
                className={`text-xs font-medium ${
                  profile.online
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {statusLabel}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      {/* ===== SKILLS ===== */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Skills
        </h3>

        {profile.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No skills added
          </p>
        )}
      </div>

      {/* ===== INTERESTS ===== */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Interests
        </h3>

        {profile.interests?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700"
              >
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No interests added
          </p>
        )}
      </div>

      {/* ===== ACTIONS ===== */}
      {profile._id !== user?.id && (
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <button
            onClick={handleBlock}
            disabled={blocking}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm transition"
          >
            {blocking ? "Blocking..." : "Block User"}
          </button>
        </div>
      )}
    </div>
  ); 
}