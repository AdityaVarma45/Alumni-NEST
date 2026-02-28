import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

/* helper */
const getLastSeenLabel = (date, online) => {
  if (online) return "Online";
  if (!date) return "Offline";

  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return "Active just now";
  if (diff < 3600) return `Active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return "Active today";

  return "Offline";
};

const UserCardSkeleton = () => (
  <div className="bg-white border rounded-xl p-4 shadow-sm animate-pulse">
    <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
    <div className="h-3 w-48 bg-gray-200 rounded" />
  </div>
);

export default function Users() {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [localMentorshipStatus, setLocalMentorshipStatus] =
    useState({});

  /* fetch all data */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, blockedRes, mentorshipRes, convoRes] =
          await Promise.all([
            axios.get("/users"),
            axios.get("/users/blocked"),
            axios.get("/mentorship"),
            axios.get("/chat/conversations"),
          ]);

        setUsers(usersRes.data);
        setBlockedUsers(blockedRes.data);
        setMentorships(mentorshipRes.data || []);
        setConversations(convoRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* mentorship map */
  const mentorshipMap = useMemo(() => {
    const map = {};
    mentorships.forEach((m) => {
      const alumniId = m.alumni?._id || m.alumni;
      map[alumniId] = m;
    });
    return map;
  }, [mentorships]);

  const findConversation = (id) =>
    conversations.find((c) =>
      c.participants?.some((p) => p._id === id)
    );

  /* smart grouping */
  const groupedUsers = useMemo(() => {
    const list = users.filter((u) => u._id !== user?.id);

    const active = [];
    const recommended = [];
    const others = [];

    list.forEach((u) => {
      const hasConversation = !!findConversation(u._id);
      const mentorship = mentorshipMap[u._id];

      if (hasConversation) {
        active.push(u);
        return;
      }

      if (
        (user?.role === "student" && u.role === "alumni") ||
        (user?.role === "alumni" && u.role === "student") ||
        mentorship?.status === "accepted"
      ) {
        recommended.push(u);
        return;
      }

      others.push(u);
    });

    return { active, recommended, others };
  }, [users, user, conversations, mentorshipMap]);

  const sendRequest = async (e, alumniId) => {
    e.preventDefault();

    try {
      await axios.post("/mentorship/request", {
        alumniId,
        message: "I would like mentorship",
      });

      setLocalMentorshipStatus((prev) => ({
        ...prev,
        [alumniId]: "pending",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  const unblockUser = async (id) => {
    try {
      await axios.post("/users/unblock", {
        userIdToUnblock: id,
      });

      setBlockedUsers((prev) =>
        prev.filter((u) => u._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* action button logic */
  const renderAction = (u) => {
    const conversation = findConversation(u._id);
    const mentorship = mentorshipMap[u._id];
    const localStatus = localMentorshipStatus[u._id];

    if (conversation) {
      return (
        <Link
          to={`/dashboard/chat/${conversation._id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-green-600 hover:underline font-medium"
        >
          Continue Chat
        </Link>
      );
    }

    if (localStatus === "pending" || mentorship?.status === "pending") {
      return (
        <span className="text-sm text-yellow-600 font-medium">
          Request Pending
        </span>
      );
    }

    if (mentorship?.status === "accepted") {
      return (
        <span className="text-sm text-green-600 font-medium">
          Mentorship Active
        </span>
      );
    }

    if (mentorship?.status === "rejected") {
      return (
        <span className="text-sm text-red-500">
          Request Rejected
        </span>
      );
    }

    return (
      <button
        onClick={(e) => sendRequest(e, u._id)}
        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
      >
        Request Mentorship
      </button>
    );
  };

  const renderUserCard = (u) => {
    const statusLabel = getLastSeenLabel(u.lastSeen, u.online);

    return (
      <Link
        key={u._id}
        to={`/dashboard/users/${u._id}`}
        className="block"
      >
        <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800">
              {u.username}
            </h3>

            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 capitalize">
              {u.role}
            </span>
          </div>

          {/* only ONE status shown */}
          <p className="text-xs text-gray-500 mt-1">
            {statusLabel}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {u.email}
          </p>

          {u.role === "alumni" && (
            <div className="mt-3">{renderAction(u)}</div>
          )}
        </div>
      </Link>
    );
  };

  const renderSection = (title, list) => {
    if (!list.length) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
        {list.map(renderUserCard)}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-xl font-bold text-gray-800">
        Browse Users
      </h2>

      {loading ? (
        <>
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
        </>
      ) : (
        <>
          {renderSection("Active Conversations", groupedUsers.active)}
          {renderSection("Recommended", groupedUsers.recommended)}
          {renderSection("Others", groupedUsers.others)}
        </>
      )}

      <div>
        <h2 className="text-xl font-bold mb-5 text-gray-800">
          Blocked Users
        </h2>

        {blockedUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No blocked users</p>
        ) : (
          <div className="space-y-3">
            {blockedUsers.map((u) => (
              <div
                key={u._id}
                className="bg-white border rounded-xl p-4 shadow-sm flex justify-between"
              >
                <div>
                  <p className="font-semibold">{u.username}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                <button
                  onClick={() => unblockUser(u._id)}
                  className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}