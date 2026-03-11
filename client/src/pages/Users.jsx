import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Search, X } from "lucide-react";

/* last seen helper */
const getLastSeenLabel = (date, online) => {
  if (online) return "Online";
  if (!date) return "Offline";

  const diff = (Date.now() - new Date(date)) / 1000;

  if (diff < 60) return "Active just now";
  if (diff < 3600) return `Active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return "Active today";

  return "Offline";
};

/* match label helper */
const getMatchLabel = (score) => {
  if (score >= 80)
    return { label: "Excellent match", color: "text-green-600 bg-green-50" };

  if (score >= 60)
    return { label: "Strong match", color: "text-blue-600 bg-blue-50" };

  if (score >= 40)
    return { label: "Good match", color: "text-amber-600 bg-amber-50" };

  return { label: "Possible match", color: "text-slate-500 bg-slate-100" };
};

/* common skills */
const getCommonSkills = (userSkills = [], otherSkills = []) => {
  return userSkills.filter((skill) =>
    otherSkills.includes(skill)
  );
};

/* skeleton */
const UserCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="space-y-1">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="h-2 w-20 bg-slate-200 rounded" />
      </div>
    </div>
    <div className="h-3 w-40 bg-slate-200 rounded" />
  </div>
);

export default function Users() {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [localMentorshipStatus, setLocalMentorshipStatus] = useState({});

  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("");

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

  const sendRequest = async (e, alumniId) => {
    e.preventDefault();
    e.stopPropagation();

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

  const offerMentorship = async (e, studentId) => {
    e.preventDefault();
    e.stopPropagation();

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

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (u._id === user?.id) return false;

      if (search && !u.username.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (roleFilter !== "all" && u.role !== roleFilter) return false;

      if (
        skillFilter &&
        !u.skills?.some((s) =>
          s.toLowerCase().includes(skillFilter.toLowerCase())
        )
      )
        return false;

      return true;
    });
  }, [users, search, roleFilter, skillFilter, user]);

  const groupedUsers = useMemo(() => {
    const active = [];
    const recommended = [];
    const others = [];

    filteredUsers.forEach((u) => {
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
  }, [filteredUsers, user, conversations, mentorshipMap]);

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
      return <span className="text-sm text-yellow-600">Request Pending</span>;

    if (mentorship?.status === "accepted")
      return <span className="text-sm text-green-600">Mentorship Active</span>;

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

  const renderUserCard = (u) => {
    const statusLabel = getLastSeenLabel(u.lastSeen, u.online);
    const match = getMatchLabel(u.matchScore || 0);
    const initial = u.username?.charAt(0)?.toUpperCase();
    const commonSkills = getCommonSkills(user?.skills || [], u.skills || []);

    return (
      <Link key={u._id} to={`/dashboard/users/${u._id}`} className="block">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:bg-slate-50 transition">

          <div className="flex items-start justify-between">

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                {initial}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">{u.username}</h3>
                <p className="text-xs text-slate-500 mt-1">{statusLabel}</p>
              </div>
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 capitalize">
              {u.role}
            </span>

          </div>

          {u.matchScore !== undefined && (
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-semibold text-slate-700">
                {u.matchScore}% match
              </span>

              <span className={`text-xs px-2 py-0.5 rounded-md ${match.color}`}>
                {match.label}
              </span>
            </div>
          )}

          {commonSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {commonSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">

            <p className="text-sm text-slate-500 truncate">
              {u.email}
            </p>

            <div className="flex items-center gap-3">
              {renderAction(u)}
            </div>

          </div>

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
    <div className="max-w-7xl mx-auto px-4 space-y-8">

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Browse Users
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Find students and alumni in the network.
            </p>
          </div>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            {showFilters ? <X size={18} /> : <Search size={18} />}
          </button>

        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 border-t border-slate-200 pt-4">

            <input
              placeholder="Search users..."
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="alumni">Alumni</option>
            </select>

            <input
              placeholder="Filter by skill..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />

          </div>
        )}

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

      </section>

    </div>
  );
}