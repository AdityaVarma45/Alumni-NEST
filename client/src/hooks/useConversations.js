import { useEffect, useReducer, useState } from "react";
import socket from "../socket";
import { getConversations } from "../services/chatService";
import { conversationReducer } from "../reducers/conversationReducer";

export const useConversations = (user) => {
  const [conversations, dispatch] = useReducer(
    conversationReducer,
    []
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const res = await getConversations();

        dispatch({
          type: "SET_CONVERSATIONS",
          payload: res.data || [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    const handleOnlineUsers = (users) => {
      dispatch({
        type: "ONLINE_USERS_UPDATED",
        users,
        userId: user.id,
      });
    };

    const handleConversationUpdated = (payload) => {
      dispatch({
        type: "CONVERSATION_UPDATED",
        payload: {
          ...payload,
          userId: user.id,
        },
      });
    };

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

  return { conversations, loading };
};