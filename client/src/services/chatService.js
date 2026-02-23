import axios from "../api/axios";

/* =================================
   CONVERSATIONS
================================= */

// Get all conversations of logged-in user
export const getConversations = () => {
  return axios.get("/chat/conversations");
};

/* =================================
   MESSAGES
================================= */

// Get messages of one conversation
export const getMessages = (conversationId) => {
  return axios.get(
    `/chat/conversations/${conversationId}/messages`
  );
};

// Send message
export const sendMessage = (conversationId, content) => {
  return axios.post(
    `/chat/conversations/${conversationId}/messages`,
    { content }
  );
};

// Mark conversation messages as read
export const markAsRead = (conversationId) => {
  return axios.put(
    `/chat/conversations/${conversationId}/read`
  );
};

/* =================================
   OPTIONAL (Future-ready)
================================= */

// Delete message (for future feature)
export const deleteMessage = (messageId, deleteForEveryone = false) => {
  return axios.delete(`/chat/messages/${messageId}`, {
    data: { deleteForEveryone },
  });
};
