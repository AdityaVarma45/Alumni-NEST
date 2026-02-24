import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import ConversationsList from "../components/ConversationsList";
import RecommendedAlumniSection from "../components/recommendations/RecommendedAlumniSection";

import { useConversations } from "../hooks/useConversations";
import { useRecommendedAlumni } from "../hooks/useRecommendedAlumni";

/*
  small helper
  greeting based on time
*/
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const conversations = useConversations(user);

  const {
    recommended,
    loading,
    error,
  } = useRecommendedAlumni();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">

      {/* ===== Greeting ===== */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, {user?.username} 👋
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Stay connected with your alumni network.
        </p>
      </section>

      {/* ===== Conversations ===== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Conversations
          </h2>

          <span className="text-xs text-gray-400">
            {conversations.length} chats
          </span>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500 shadow-sm">
            Start your first conversation with alumni 🚀
          </div>
        ) : (
          <ConversationsList
            conversations={conversations}
            user={user}
          />
        )}
      </section>

      {/* ===== Recommended Alumni ===== */}
      <section>
        <RecommendedAlumniSection
          alumni={recommended}
          loading={loading}
          error={error}
        />
      </section>

    </div>
  );
}