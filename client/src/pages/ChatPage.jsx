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
    ) || {};

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
        shadow-sm
        overflow-hidden
      "
    >

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200">
        <ChatHeader
          userName={otherUser?.username || "User"}
          online={currentConversation?.online}
          typing={typingUser}
          lastSeen={currentConversation?.lastSeen}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatMessages
          messages={messages}
          user={user}
          typingUser={typingUser}
          getMessageStatus={getMessageStatus}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white border-t border-slate-200">
        <ChatInput
          newMessage={newMessage}
          onChange={handleTyping}
          onSend={sendMessage}
        />
      </div>

      {/* Scroll Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="
            absolute bottom-20 md:bottom-24 right-6
            bg-blue-600 text-white
            text-sm font-medium
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