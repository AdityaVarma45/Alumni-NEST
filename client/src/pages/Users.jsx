import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Users() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const sendRequest = async (alumniId) => {
    try {
      await axios.post("/mentorship/request", {
        alumniId,
        message: "I would like mentorship",
      });

      alert("Mentorship request sent");
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Users</h2>

      {users
        .filter((u) => u._id !== user.id)
        .map((u) => (
          <div
            key={u._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>{u.username}</strong></p>
            <p>{u.role}</p>

            {u.role === "alumni" && (
              <button onClick={() => sendRequest(u._id)}>
                Request Mentorship
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
