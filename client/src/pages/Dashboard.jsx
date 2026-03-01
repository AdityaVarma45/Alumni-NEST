import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import ConversationsList from "../components/ConversationsList";
import RecommendedAlumniSection from "../components/recommendations/RecommendedAlumniSection";

import { useConversations } from "../hooks/useConversations";
import { useRecommendedAlumni } from "../hooks/useRecommendedAlumni";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const {
    conversations,
    loading: conversationsLoading,
  } = useConversations(user);

  const {
    alumni: recommendedAlumni,
    loading: recommendationsLoading,
  } = useRecommendedAlumni();

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Conversations card */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Chats
        </h2>

        <ConversationsList
          conversations={conversations}
          user={user}
          loading={conversationsLoading}
        />
      </section>

      {/* Recommended alumni card */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recommended Alumni
        </h2>

        <RecommendedAlumniSection
          alumni={recommendedAlumni}
          loading={recommendationsLoading}
        />
      </section>

    </div>
  );
}