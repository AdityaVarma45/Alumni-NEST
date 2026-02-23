export default function ChatInput({
  newMessage,
  onChange,
  onSend,
}) {
  return (
    <div className="p-4 bg-white flex gap-3 border-t">

      {/* message input */}
      <input
        value={newMessage}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
      />

      {/* send button */}
      <button
        onClick={onSend}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}