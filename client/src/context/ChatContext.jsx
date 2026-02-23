import { createContext, useContext, useEffect, useReducer } from "react";
import socket from "../socket";
import { getConversations } from "../services/chatService";
import { conversationReducer } from "../reducers/conversationReducer";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { playNotificationSound } from "../utils/playNotificationSound";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [conversations, dispatch] = useReducer(
    conversationReducer,
    []
  );

  useEffect(() => {
    if (!user) return;

    /* ===============================
       INITIAL LOAD
    =============================== */
    const fetchConversations = async () => {
      try {
        const res = await getConversations();

        dispatch({
          type: "SET_CONVERSATIONS",
          payload: res.data,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchConversations();

    /* ===============================
       SOCKET EVENTS
    =============================== */

    // online users update
    const handleOnlineUsers = (users) => {
      dispatch({
        type: "ONLINE_USERS_UPDATED",
        users,
        userId: user.id,
      });
    };

    // 🔥 NEW MESSAGE EVENT
    const handleConversationUpdated = (payload) => {
      dispatch({
        type: "CONVERSATION_UPDATED",
        payload: {
          ...payload,
          userId: user.id,
        },
      });

      // check if user already inside this chat
      const activeConversationId =
        window.location.pathname.split("/").pop();

      const isCurrentChat =
        payload.conversationId === activeConversationId;

      // only notify if NOT inside active chat
      if (!isCurrentChat) {
        // 🔊 play sound
        playNotificationSound();

        // 🔥 toast notification
        toast.custom(
          (t) => (
            <div
              className="bg-white shadow-lg rounded-xl px-4 py-3 cursor-pointer border"
              onClick={() => {
                toast.dismiss(t.id);
                window.location.href = `/dashboard/chat/${payload.conversationId}`;
              }}
            >
              <p className="font-semibold text-sm">
                New message
              </p>
              <p className="text-xs text-gray-600 truncate">
                {payload.message?.content}
              </p>
            </div>
          ),
          { duration: 3000 }
        );
      }
    };

    // unread sync
    const handleUnreadUpdated = (payload) => {
      dispatch({
        type: "UNREAD_UPDATED",
        payload,
      });
    };

    // typing indicators
    const handleUserTyping = ({ conversationId }) => {
      dispatch({
        type: "CONVERSATION_TYPING",
        conversationId,
        typing: true,
      });
    };

    const handleStopTyping = ({ conversationId }) => {
      dispatch({
        type: "CONVERSATION_TYPING",
        conversationId,
        typing: false,
      });
    };

    /* ===============================
       REGISTER LISTENERS
    =============================== */
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("conversationUpdated", handleConversationUpdated);
    socket.on("conversationUnreadUpdated", handleUnreadUpdated);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleStopTyping);

    /* ===============================
       CLEANUP
    =============================== */
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("conversationUpdated", handleConversationUpdated);
      socket.off("conversationUnreadUpdated", handleUnreadUpdated);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleStopTyping);
    };
  }, [user]);

  return (
    <ChatContext.Provider value={{ conversations, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};