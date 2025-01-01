import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

interface MessageInputProps {
  onSend: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    onSend(message);
    setMessage("");
  };

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-xl w-2 h-2 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
      >
        😀
      </button>
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 z-10 mb-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border border-gray-300 rounded-full pl-12 pr-16 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-sm px-4 py-1 rounded-full hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};
