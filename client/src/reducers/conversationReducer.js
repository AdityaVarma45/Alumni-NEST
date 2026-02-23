// conversationReducer.js
// global brain for sidebar conversations

export const conversationReducer = (state, action) => {
  switch (action.type) {

    /* -----------------------------------------
       Initial load from backend
    ------------------------------------------*/
    case "SET_CONVERSATIONS":
      return action.payload;

    /* -----------------------------------------
       Online users update
    ------------------------------------------*/
    case "ONLINE_USERS_UPDATED":
      return state.map((conv) => {
        const other = conv.participants.find(
          (p) => p._id !== action.userId
        );

        return {
          ...conv,
          online: action.users.includes(other?._id),
        };
      });

    /* -----------------------------------------
       New message received
       → update preview
       → update unread
       → move to top
    ------------------------------------------*/
    case "CONVERSATION_UPDATED": {
      const { conversationId, message, userId } = action.payload;

      const existing = state.find(
        (conv) => conv._id === conversationId
      );

      if (!existing) return state;

      const isMine =
        message.sender?.toString() === userId;

      const updatedConversation = {
        ...existing,
        lastMessage: message.content,
        updatedAt: message.createdAt || new Date(),

        // unread increases ONLY if message not mine
        unreadCount: isMine
          ? existing.unreadCount
          : (existing.unreadCount || 0) + 1,
      };

      // move active conversation to top
      const others = state.filter(
        (conv) => conv._id !== conversationId
      );

      return [updatedConversation, ...others];
    }

    /* -----------------------------------------
       Reset unread count (when chat opened)
    ------------------------------------------*/
    case "UNREAD_UPDATED":
      return state.map((conv) =>
        conv._id === action.payload.conversationId
          ? {
              ...conv,
              unreadCount: action.payload.unreadCount,
            }
          : conv
      );

    default:
      return state;
  }
};