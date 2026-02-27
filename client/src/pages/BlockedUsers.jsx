import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function BlockedUsers() {
  const [users, setUsers] = useState([]);

  const fetchBlocked = async () => {
    try {
      const res = await axios.get("/users/blocked");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlocked();
  }, []);

  const handleUnblock = async (id) => {
    try {
      await axios.post("/users/unblock", {
        userIdToUnblock: id,
      });

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Blocked Users</h2>

      {!users.length && <p>No blocked users</p>}

      {users.map((u) => (
        <div
          key={u._id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginTop: 10,
            borderRadius: 8,
          }}
        >
          <strong>{u.username}</strong>
          <p>{u.role}</p>

          <button
            onClick={() => handleUnblock(u._id)}
            style={{
              marginTop: 8,
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: 6,
            }}
          >
            Unblock
          </button>
        </div>
      ))}
    </div>
  );
}