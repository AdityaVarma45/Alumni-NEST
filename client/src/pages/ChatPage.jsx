import { useParams } from "react-router-dom";
import { useContext, useMemo } from "react";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import { useSocket } from "../hooks/useSocket";
import { useChatMessages } from "../hooks/useChatMessages";

import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";

export default function ChatPage() {
  const { conversationId } = useParams();

  const { user } = useContext(AuthContext);
  const { conversations } = useContext(ChatContext);

  // keep socket active
  useSocket(user?.id);

  const currentConversation = useMemo(
    () =>
      conversations.find(
        (c) => c._id === conversationId
      ),
    [conversations, conversationId]
  );

  const otherUser =
    currentConversation?.participants?.find(
      (p) => p._id !== user?.id
    );

  const {
    messages,
    newMessage,
    typingUser,
    messagesEndRef,
    handleTyping,
    sendMessage,
    getMessageStatus,
    showScrollButton,
    scrollToBottom,
  } = useChatMessages(conversationId, user);

  return (
    <div
      className="
        relative flex flex-col
        h-full min-h-0
        bg-slate-50
        rounded-2xl
        border border-slate-200
        overflow-hidden
      "
    >
      {/* ===============================
          HEADER
      =============================== */}
      <div className="shrink-0 bg-white">
        <ChatHeader
          userName={otherUser?.username || "User"}
          online={currentConversation?.online}
          typing={typingUser}
          lastSeen={currentConversation?.lastSeen}
        />
      </div>

      {/* ===============================
          MESSAGES (takes remaining space)
      =============================== */}
      <div className="flex-1 min-h-0">
        <ChatMessages
          messages={messages}
          user={user}
          typingUser={typingUser}
          getMessageStatus={getMessageStatus}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* ===============================
          INPUT AREA
      =============================== */}
      <div className="shrink-0 bg-white">
        <ChatInput
          newMessage={newMessage}
          onChange={handleTyping}
          onSend={sendMessage}
        />
      </div>

      {/* ===============================
          FLOATING SCROLL BUTTON
      =============================== */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="
            absolute bottom-24 right-6 z-30
            bg-blue-600 text-white
            px-3 py-2 rounded-full
            shadow-lg hover:bg-blue-700
            transition-all duration-200
          "
        >
          ↓ New
        </button>
      )}
    </div>
  );
}