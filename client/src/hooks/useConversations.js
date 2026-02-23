import { useEffect, useReducer } from "react";
import socket from "../socket";
import { getConversations } from "../services/chatService";
import { conversationReducer } from "../reducers/conversationReducer";

export const useConversations = (user) => {
  const [conversations, dispatch] = useReducer(
    conversationReducer,
    []
  );

  useEffect(() => {
    if (!user) return;

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

    /* ===== ONLINE USERS ===== */
    const handleOnlineUsers = (users) => {
      dispatch({
        type: "ONLINE_USERS_UPDATED",
        users,
        userId: user.id,
      });
    };

    /* ===== CONVERSATION UPDATED ===== */
    const handleConversationUpdated = (payload) => {
      dispatch({
        type: "CONVERSATION_UPDATED",
        payload: {
          ...payload,
          userId: user.id,
        },
      });
    };

    /* ===== UNREAD RESET ===== */
    const handleUnreadUpdated = (payload) => {
      dispatch({
        type: "UNREAD_UPDATED",
        payload,
      });
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("conversationUpdated", handleConversationUpdated);
    socket.on("conversationUnreadUpdated", handleUnreadUpdated);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("conversationUpdated", handleConversationUpdated);
      socket.off("conversationUnreadUpdated", handleUnreadUpdated);
    };
  }, [user]);

  return conversations;
};
