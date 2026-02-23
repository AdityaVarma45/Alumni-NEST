import { useEffect, useRef, useState } from "react";

/* ======================================================
   Small helper functions (easy to understand)
====================================================== */

// format time like 10:45 PM
const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

// show Today / Yesterday / normal date
const getDayLabel = (date) => {
  const msgDate = new Date(date);
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) return "Today";
  if (msgDate.toDateString() === yesterday.toDateString())
    return "Yesterday";

  return msgDate.toLocaleDateString();
};

// check if message contains only emojis
const isEmojiOnly = (text = "") => {
  const emojiRegex = /^(\p{Extended_Pictographic}|\s)+$/u;
  return emojiRegex.test(text.trim());
};

// check if message is a link
const isLink = (text = "") =>
  /(https?:\/\/[^\s]+)/g.test(text);

export default function ChatMessages({
  messages,
  user,
  typingUser,
  getMessageStatus,
  messagesEndRef,
}) {
  // reference to scroll container
  const containerRef = useRef(null);

  // show/hide scroll-to-bottom button
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  /* ======================================================
     Detect scroll position
     → show button when user scrolls up
  ====================================================== */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      setShowScrollBtn(distanceFromBottom > 250);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // scroll smoothly to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex-1">
      {/* ==================================================
         Scrollable message area
      ================================================== */}
      <div
        ref={containerRef}
        className="
          absolute inset-0
          overflow-y-auto
          p-6 space-y-2
          bg-[#f5f7fb]
          scroll-smooth
        "
      >
        {messages.map((msg, index) => {
          const isMine = msg.sender?._id
            ? msg.sender._id.toString() === user?.id
            : msg.sender?.toString() === user?.id;

          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];

          const prevIsMine =
            prevMsg &&
            (prevMsg.sender?._id
              ? prevMsg.sender._id.toString() === user?.id
              : prevMsg.sender?.toString() === user?.id);

          const nextIsMine =
            nextMsg &&
            (nextMsg.sender?._id
              ? nextMsg.sender._id.toString() === user?.id
              : nextMsg.sender?.toString() === user?.id);

          // grouping messages from same sender
          const isGrouped = prevMsg && prevIsMine === isMine;
          const isLastInGroup = !nextMsg || nextIsMine !== isMine;

          // day separator logic
          const showDaySeparator =
            !prevMsg ||
            getDayLabel(prevMsg.createdAt) !==
              getDayLabel(msg.createdAt);

          // unread divider
          const showUnreadDivider =
            !isMine &&
            !msg.isRead &&
            (index === 0 || messages[index - 1].isRead);

          const status = getMessageStatus(msg);

          const content = msg.content || "";
          const length = content.length;

          // adaptive bubble width
          let bubbleWidth = "max-w-[75%]";
          if (isEmojiOnly(content)) bubbleWidth = "max-w-fit";
          else if (length < 12) bubbleWidth = "max-w-fit min-w-[80px]";
          else if (length < 80) bubbleWidth = "max-w-[65%]";
          else bubbleWidth = "max-w-[80%]";

          return (
            <div key={msg._id}>
              {/* Day label */}
              {showDaySeparator && (
                <div className="sticky top-2 z-10 flex justify-center my-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-300/80 text-gray-700 shadow-sm">
                    {getDayLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              {/* New message divider */}
              {showUnreadDivider && (
                <div className="flex justify-center my-3">
                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    New messages
                  </span>
                </div>
              )}

              {/* Message row */}
              <div
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                } ${isGrouped ? "mt-1" : "mt-3"}`}
              >
                {/* Bubble */}
                <div
                  className={`
                    ${bubbleWidth}
                    px-4 py-2
                    shadow-sm hover:shadow-md
                    transition-all duration-200
                    ${
                      isMine
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800"
                    }
                    ${
                      isMine
                        ? isGrouped
                          ? isLastInGroup
                            ? "rounded-2xl rounded-br-md"
                            : "rounded-2xl rounded-r-md"
                          : "rounded-2xl rounded-br-md"
                        : isGrouped
                        ? isLastInGroup
                          ? "rounded-2xl rounded-bl-md"
                          : "rounded-2xl rounded-l-md"
                        : "rounded-2xl rounded-bl-md"
                    }
                    ${msg.optimistic ? "opacity-60" : ""}
                  `}
                >
                  <div className="flex flex-col">
                    {/* Message content */}
                    {isLink(content) ? (
                      <a
                        href={content}
                        target="_blank"
                        rel="noreferrer"
                        className={`underline break-all ${
                          isMine ? "text-blue-100" : "text-blue-600"
                        }`}
                      >
                        {content}
                      </a>
                    ) : (
                      <span
                        className={`${
                          isEmojiOnly(content) ? "text-3xl" : "text-sm"
                        }`}
                      >
                        {content}
                      </span>
                    )}

                    {/* time + ticks */}
                    <div className="flex justify-end items-center mt-1 gap-2">
                      <span className="text-[10px] opacity-70">
                        {formatTime(msg.createdAt)}
                      </span>

                      {isMine && (
                        <span className={`text-xs ${status.color}`}>
                          {status.icon}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* typing indicator */}
        {typingUser && (
          <div className="text-sm text-gray-500 pl-2">
            typing...
          </div>
        )}

        {/* bottom anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ==================================================
         Floating center button
      ================================================== */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="
            absolute bottom-24 left-1/2 -translate-x-1/2
            bg-blue-600 text-white
            w-10 h-10 rounded-full
            shadow-lg hover:bg-blue-700
            transition-all duration-200
            z-30
          "
        >
          ↓
        </button>
      )}
    </div>
  );
}