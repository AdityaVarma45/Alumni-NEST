import { Send } from "lucide-react";

/*
  Chat input
  - clean SPA footer
  - modern rounded input
  - safe layout (no height issues)
*/

export default function ChatInput({
  newMessage,
  onChange,
  onSend,
}) {

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (newMessage.trim()) {
        onSend();
      }
    }
  };

  const isDisabled = !newMessage?.trim();

  return (
    <div className="bg-white border-t border-slate-200 px-4 md:px-6 py-3">

      <div
        className="
          flex items-center gap-3
          bg-slate-50
          border border-slate-200
          rounded-xl
          px-3 py-2
          shadow-sm
          focus-within:ring-2
          focus-within:ring-blue-100
          focus-within:border-blue-200
          transition-all
        "
      >

        {/* Input */}
        <input
          value={newMessage}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="
            flex-1 bg-transparent
            text-sm text-slate-700
            placeholder:text-slate-400
            focus:outline-none
          "
        />

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={isDisabled}
          className="
            h-9 w-9 rounded-lg
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white
            flex items-center justify-center
            hover:opacity-90
            active:scale-95
            transition-all duration-150
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <Send size={16} />
        </button>

      </div>

    </div>
  );
}