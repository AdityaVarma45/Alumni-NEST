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
    <div className="relative flex flex-col h-full bg-slate-50">

      {/* Header */}
      <div className="shrink-0 border-b border-slate-200 bg-white">
        <ChatHeader
          userName={otherUser?.username || "User"}
          online={currentConversation?.online}
          typing={typingUser}
          lastSeen={currentConversation?.lastSeen}
        />
      </div>

      {/* Messages area */}
      <div className="flex-1 min-h-0">
        <ChatMessages
          messages={messages}
          user={user}
          typingUser={typingUser}
          getMessageStatus={getMessageStatus}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-slate-200 bg-white">
        <ChatInput
          newMessage={newMessage}
          onChange={handleTyping}
          onSend={sendMessage}
        />
      </div>

      {/* Floating scroll button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="
            absolute bottom-24 right-6 z-30
            bg-blue-600 text-white
            px-3 py-2 rounded-full
            shadow-lg hover:bg-blue-700
            transition-all
          "
        >
          ↓ New
        </button>
      )}
    </div>
  );
}