export const conversationReducer = (state, action) => {
  switch (action.type) {
    case "SET_CONVERSATIONS": {
      return sortConversations(action.payload);
    }

    case "ONLINE_USERS_UPDATED": {
      const updated = state.map((conv) => {
        const other = conv.participants.find(
          (p) => p._id !== action.userId
        );

        return {
          ...conv,
          online: action.users.includes(other?._id),
        };
      });

      return sortConversations(updated);
    }

    case "CONVERSATION_UPDATED": {
      const { conversationId, message, userId } = action.payload;

      const updated = state.map((conv) => {
        if (conv._id !== conversationId) return conv;

        const isMine =
          message.sender?.toString() === userId;

        return {
          ...conv,
          lastMessage: message.content,
          updatedAt: message.createdAt || new Date(),
          unreadCount: isMine
            ? conv.unreadCount || 0
            : (conv.unreadCount || 0) + 1,
        };
      });

      return sortConversations(updated);
    }

    case "UNREAD_UPDATED": {
      const updated = state.map((conv) =>
        conv._id === action.payload.conversationId
          ? {
              ...conv,
              unreadCount: action.payload.unreadCount,
            }
          : conv
      );

      return sortConversations(updated);
    }

    case "CONVERSATION_TYPING": {
      const updated = state.map((conv) =>
        conv._id === action.conversationId
          ? { ...conv, typing: action.typing }
          : conv
      );

      return sortConversations(updated);
    }

    default:
      return state;
  }
};

/* ----------------------------------
   AI SORT ENGINE
----------------------------------- */

const sortConversations = (conversations = []) => {
  return [...conversations].sort((a, b) => {
    // 1. typing has highest priority
    if (a.typing && !b.typing) return -1;
    if (!a.typing && b.typing) return 1;

    // 2. unread priority
    if ((a.unreadCount || 0) > 0 && (b.unreadCount || 0) === 0)
      return -1;
    if ((a.unreadCount || 0) === 0 && (b.unreadCount || 0) > 0)
      return 1;

    // 3. online users priority
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;

    // 4. latest activity fallback
    return (
      new Date(b.updatedAt || 0) -
      new Date(a.updatedAt || 0)
    );
  });
};