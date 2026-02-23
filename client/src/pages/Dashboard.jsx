import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useConversations } from "../hooks/useConversations";
import axios from "../api/axios";

import ConversationsList from "../components/ConversationsList";
import MentorRecommendations from "../components/MentorRecommendations";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // existing conversations logic
  const conversations = useConversations(user);

  // 👑 mentor recommendations
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get("/users/matches");
        setMentors(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMentors();
  }, []);

  return (
    <div className="h-full p-6 overflow-y-auto space-y-6">

      {/* 🔥 smart mentor suggestions */}
      <MentorRecommendations mentors={mentors} />

      {/* existing conversations */}
      <ConversationsList
        conversations={conversations}
        user={user}
      />

    </div>
  );
}