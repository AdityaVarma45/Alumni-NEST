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

/* skeleton */
const UserCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
    <div className="h-4 w-32 bg-slate-200 rounded mb-3" />
    <div className="h-3 w-48 bg-slate-200 rounded" />
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

  /* fetch */
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

  /* mentorship map supporting both directions */
const mentorshipMap = useMemo(() => {
  const map = {};

  mentorships.forEach((m) => {
    if (user?.role === "student") {
      const alumniId = m.alumni?._id || m.alumni;
      map[alumniId] = m;
    }

    if (user?.role === "alumni") {
      const studentId = m.student?._id || m.student;
      map[studentId] = m;
    }
  });

  return map;
}, [mentorships, user?.role]);


  const findConversation = (id) =>
    conversations.find((c) =>
      c.participants?.some((p) => p._id === id)
    );

  /* group users */
  const groupedUsers = useMemo(() => {
    const list = users.filter((u) => u._id !== user?.id);

    const active = [];
    const recommended = [];
    const others = [];

    list.forEach((u) => {
      const hasConversation = !!findConversation(u._id);
      const mentorship = mentorshipMap[u._id];

      if (hasConversation) return active.push(u);

      if (
        (user?.role === "student" && u.role === "alumni") ||
        (user?.role === "alumni" && u.role === "student") ||
        mentorship?.status === "accepted"
      ) {
        return recommended.push(u);
      }

      others.push(u);
    });

    return { active, recommended, others };
  }, [users, user, conversations, mentorshipMap]);

  /* student sends request */
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

  /* alumni offers mentorship */
  const offerMentorship = async (e, studentId) => {
    e.preventDefault();

    try {
      await axios.post("/mentorship/offer", {
        studentId,
        message: "I'd like to mentor you.",
      });

      setLocalMentorshipStatus((prev) => ({
        ...prev,
        [studentId]: "pending",
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

  /* action logic */
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

    if (localStatus === "pending" || mentorship?.status === "pending")
      return (
        <span className="text-sm text-yellow-600">
          Request Pending
        </span>
      );

    if (mentorship?.status === "accepted")
      return (
        <span className="text-sm text-green-600">
          Mentorship Active
        </span>
      );

    if (mentorship?.status === "rejected")
      return (
        <span className="text-sm text-red-500">
          Request Rejected
        </span>
      );

    /* student → request */
    if (user?.role === "student" && u.role === "alumni") {
      return (
        <button
          onClick={(e) => sendRequest(e, u._id)}
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
        >
          Request Mentorship
        </button>
      );
    }

    /* alumni → offer */
    if (user?.role === "alumni" && u.role === "student") {
      return (
        <button
          onClick={(e) => offerMentorship(e, u._id)}
          className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
        >
          Offer Mentorship
        </button>
      );
    }

    return null;
  };

  /* user card */
  const renderUserCard = (u) => {
    const statusLabel = getLastSeenLabel(u.lastSeen, u.online);

    return (
      <Link key={u._id} to={`/dashboard/users/${u._id}`} className="block">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:bg-slate-50 transition">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-slate-800">
              {u.username}
            </h3>

            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 capitalize">
              {u.role}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {statusLabel}
          </p>

          <p className="text-sm text-slate-500 mt-1">{u.email}</p>

          <div className="mt-3">{renderAction(u)}</div>
        </div>
      </Link>
    );
  };

  const renderSection = (title, list) => {
    if (!list.length) return null;

    return (
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </h3>

        {list.map(renderUserCard)}
      </section>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* users */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-800">
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
            {renderSection(
              "Active Conversations",
              groupedUsers.active
            )}
            {renderSection("Recommended", groupedUsers.recommended)}
            {renderSection("Others", groupedUsers.others)}
          </>
        )}
      </section>

      {/* blocked */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          Blocked Users
        </h2>

        {blockedUsers.length === 0 ? (
          <p className="text-sm text-slate-500">
            No blocked users
          </p>
        ) : (
          <div className="space-y-3">
            {blockedUsers.map((u) => (
              <div
                key={u._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {u.username}
                  </p>
                  <p className="text-sm text-slate-500">
                    {u.email}
                  </p>
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
      </section>
    </div>
  );
}