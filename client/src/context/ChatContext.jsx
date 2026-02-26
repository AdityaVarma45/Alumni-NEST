import { createContext, useContext, useEffect, useReducer, useState } from "react";
import socket from "../socket";
import { getConversations } from "../services/chatService";
import { conversationReducer } from "../reducers/conversationReducer";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { playNotificationSound } from "../utils/playNotificationSound";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [conversations, dispatch] = useReducer(conversationReducer, []);
  const [mentorshipUpdates, setMentorshipUpdates] = useState({});

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

      const activeConversationId =
        window.location.pathname.split("/").pop();

      if (payload.conversationId !== activeConversationId) {
        playNotificationSound();

        toast.custom((t) => (
          <div
            className="bg-white shadow-lg rounded-xl px-4 py-3 border cursor-pointer"
            onClick={() => {
              toast.dismiss(t.id);
              window.location.href = `/dashboard/chat/${payload.conversationId}`;
            }}
          >
            <p className="font-semibold text-sm">New message</p>
            <p className="text-xs text-gray-600 truncate">
              {payload.message?.content}
            </p>
          </div>
        ));
      }
    };

    const handleMentorshipStatus = (payload) => {
      setMentorshipUpdates((prev) => ({
        ...prev,
        [payload.alumniId]: payload,
      }));
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("conversationUpdated", handleConversationUpdated);
    socket.on("mentorshipStatusUpdated", handleMentorshipStatus);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("conversationUpdated", handleConversationUpdated);
      socket.off("mentorshipStatusUpdated", handleMentorshipStatus);
    };
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        dispatch,
        mentorshipUpdates,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};