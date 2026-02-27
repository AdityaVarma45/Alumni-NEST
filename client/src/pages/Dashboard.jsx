import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ConversationsList from "../components/ConversationsList";
import RecommendedAlumniSection from "../components/recommendations/RecommendedAlumniSection";

import { useConversations } from "../hooks/useConversations";
import { useRecommendedAlumni } from "../hooks/useRecommendedAlumni";

/*
  Dashboard page
  - conversations list
  - smart alumni recommendations
*/

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // 🔥 updated (hook now returns object)
  const { conversations, loading } = useConversations(user);

  const recommendedAlumni = useRecommendedAlumni();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* conversations */}
      <ConversationsList
        conversations={conversations}
        user={user}
        loading={loading}
      />

      {/* smart recommendation feed */}
      <RecommendedAlumniSection
        alumni={recommendedAlumni}
      />
    </div>
  );
}