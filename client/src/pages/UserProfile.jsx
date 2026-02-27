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
      navigate("/users");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to block");
    } finally {
      setBlocking(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!profile) return <p style={{ padding: 20 }}>User not found</p>;

  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
      <h2>{profile.username}</h2>

      <p style={{ color: "#666" }}>{profile.role}</p>

      <p style={{ marginTop: 10 }}>
        <strong>Status:</strong>{" "}
        {profile.online
          ? "Online"
          : profile.lastSeen
          ? `Last seen ${new Date(profile.lastSeen).toLocaleString()}`
          : "Offline"}
      </p>

      <div style={{ marginTop: 20 }}>
        <h3>Skills</h3>
        <p>
          {profile.skills?.length
            ? profile.skills.join(", ")
            : "No skills added"}
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Interests</h3>
        <p>
          {profile.interests?.length
            ? profile.interests.join(", ")
            : "No interests added"}
        </p>
      </div>

      {/* block button (cannot block yourself) */}
      {profile._id !== user?.id && (
        <button
          onClick={handleBlock}
          disabled={blocking}
          style={{
            marginTop: 30,
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {blocking ? "Blocking..." : "Block User"}
        </button>
      )}
    </div>
  );
}