import { useContext } from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import ConversationsList from "../components/ConversationsList";
import { useConversations } from "../hooks/useConversations";

export default function Chats() {
  const { user } = useContext(AuthContext);

  const { conversations, loading } = useConversations(user);

  const isEmpty =
    !loading && (!conversations || conversations.length === 0);

  return (
    <div className="max-w-6xl mx-auto">

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Chats
        </h2>

        {/* EMPTY STATE */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center text-center py-14 px-6">

            {/* Icon */}
            <div className="bg-slate-100 rounded-full p-4 mb-4">
              <MessageSquare className="text-slate-500" size={28} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-800">
              No conversations yet
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              {user?.role === "student"
                ? "Start by requesting mentorship from alumni. Once your request is accepted, your chat will appear here."
                : "Accept mentorship requests or offer mentorship to students to start conversations."}
            </p>

            {/* CTA */}
            <Link
              to="/dashboard/users"
              className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              Browse Users
            </Link>

          </div>
        )}

        {/* CONVERSATIONS */}
        {!isEmpty && (
          <ConversationsList
            conversations={conversations}
            user={user}
            loading={loading}
          />
        )}

      </section>

    </div>
  );
}