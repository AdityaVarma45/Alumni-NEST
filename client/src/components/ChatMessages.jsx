import { useEffect, useRef, useState } from "react";

// format time
const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

// day separator label
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

// emoji check
const isEmojiOnly = (text = "") => {
  const emojiRegex = /^(\p{Extended_Pictographic}|\s)+$/u;
  return emojiRegex.test(text.trim());
};

// link check
const isLink = (text = "") =>
  /(https?:\/\/[^\s]+)/g.test(text);

export default function ChatMessages({
  messages,
  user,
  typingUser,
  getMessageStatus,
  messagesEndRef,
}) {
  const containerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // detect scroll position
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        className="
          h-full overflow-y-auto
          px-5 md:px-6 py-4
          space-y-2
          bg-slate-50
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

          const isGrouped = prevMsg && prevIsMine === isMine;
          const isLastInGroup = !nextMsg || nextIsMine !== isMine;

          const showDaySeparator =
            !prevMsg ||
            getDayLabel(prevMsg.createdAt) !==
              getDayLabel(msg.createdAt);

          const showUnreadDivider =
            !isMine &&
            !msg.isRead &&
            (index === 0 || messages[index - 1].isRead);

          const status = getMessageStatus(msg);

          const content = msg.content || "";
          const length = content.length;

          let bubbleWidth = "max-w-[75%]";
          if (isEmojiOnly(content)) bubbleWidth = "max-w-fit";
          else if (length < 12)
            bubbleWidth = "max-w-fit min-w-[80px]";
          else if (length < 80) bubbleWidth = "max-w-[65%]";
          else bubbleWidth = "max-w-[80%]";

          return (
            <div key={msg._id}>
              {/* day separator */}
              {showDaySeparator && (
                <div className="flex justify-center my-5">
                  <span className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm">
                    {getDayLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              {/* unread divider */}
              {showUnreadDivider && (
                <div className="flex justify-center my-3">
                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    New messages
                  </span>
                </div>
              )}

              {/* message row */}
              <div
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                } ${isGrouped ? "mt-1" : "mt-3"}`}
              >
                <div
                  className={`
                    ${bubbleWidth}
                    px-4 py-2
                    transition-all duration-200
                    shadow-sm
                    ${
                      isMine
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-800 border border-slate-200"
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
                          isEmojiOnly(content)
                            ? "text-3xl"
                            : "text-sm"
                        }`}
                      >
                        {content}
                      </span>
                    )}

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
          <div className="text-sm text-slate-500 pl-2 animate-pulse">
            typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* scroll button */}
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