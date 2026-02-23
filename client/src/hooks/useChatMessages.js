import { useEffect, useState, useRef, useContext } from "react";
import socket from "../socket";
import {
  getMessages,
  sendMessage as sendMessageAPI,
  markAsRead,
} from "../services/chatService";
import { ChatContext } from "../context/ChatContext";

export function useChatMessages(conversationId, user) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState(false);

  // 👑 infinite scroll engine
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOld, setLoadingOld] = useState(false);

  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { dispatch } = useContext(ChatContext);

  /* ===============================
     INITIAL LOAD
  =============================== */
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const res = await getMessages(conversationId);

      // backend may return array OR object
      const msgs = Array.isArray(res.data) ? res.data : res.data.messages || [];

      setMessages([...msgs].reverse());
      setHasMore(res.data.hasMore);

      await markAsRead(conversationId);
      // update sidebar unread instantly
      dispatch({
        type: "UNREAD_UPDATED",
        payload: {
          conversationId,
          unreadCount: 0,
        },
      });

      socket.emit("messagesRead", {
        conversationId,
        readerId: user.id,
      });
    };

    fetchMessages();
    setPage(1);
  }, [conversationId]);

  /* ===============================
     LOAD OLDER MESSAGES (TOP SCROLL)
  =============================== */
  const loadOlderMessages = async () => {
    if (!hasMore || loadingOld) return;

    setLoadingOld(true);

    const nextPage = page + 1;

    const container = containerRef.current;
    const oldHeight = container.scrollHeight;

    try {
      const res = await getMessages(conversationId, nextPage);

      setMessages((prev) => [...res.data.messages.reverse(), ...prev]);

      setHasMore(res.data.hasMore);
      setPage(nextPage);

      // preserve scroll position (pro move)
      setTimeout(() => {
        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - oldHeight;
      }, 0);
    } finally {
      setLoadingOld(false);
    }
  };

  /* ===============================
     TOP SCROLL DETECTION
  =============================== */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 80) {
        loadOlderMessages();
      }

      const distance =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      setShowScrollButton(distance > 250);
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, hasMore]);

  /* ===============================
     SOCKET EVENTS
  =============================== */
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("joinConversation", conversationId);

    const handleReceiveMessage = async (message) => {
      if (message.conversation?.toString() !== conversationId) return;

      setMessages((prev) => [...prev, message]);

      dispatch({
        type: "CONVERSATION_UPDATED",
        payload: {
          conversationId,
          message,
          userId: user.id,
        },
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [conversationId]);

  /* ===============================
     AUTO SCROLL (NEW MSG)
  =============================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  /* ===============================
     SEND MESSAGE
  =============================== */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempId = Date.now().toString();

    const optimisticMessage = {
      _id: tempId,
      content: newMessage,
      sender: user.id,
      optimistic: true,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    const text = newMessage;
    setNewMessage("");

    const res = await sendMessageAPI(conversationId, text);

    setMessages((prev) => prev.map((m) => (m._id === tempId ? res.data : m)));
  };

  const handleTyping = (value) => {
    setNewMessage(value);

    socket.emit("typing", {
      conversationId,
      userId: user.id,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        conversationId,
        userId: user.id,
      });
    }, 1000);
  };

  const getMessageStatus = (msg) => {
    if (msg.optimistic) return { icon: "⏳", color: "text-gray-300" };

    if (msg.isRead) return { icon: "✓✓", color: "text-blue-400" };

    if (msg.isDelivered) return { icon: "✓✓", color: "text-gray-300" };

    return { icon: "✓", color: "text-gray-300" };
  };

  return {
    messages,
    newMessage,
    typingUser,
    messagesEndRef,
    containerRef,
    handleTyping,
    sendMessage,
    getMessageStatus,
    showScrollButton,
    scrollToBottom,
    loadingOld,
  };
}
