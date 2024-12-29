import React from "react";

interface ChatWindowProps {
  messages: string[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="border border-gray-300 p-4 h-[300px] overflow-y-auto mb-4 rounded-lg shadow-sm">
      {messages.map((msg, index) => (
        <div className="my-2 p-2 bg-white rounded shadow" key={index}>
          {msg}
        </div>
      ))}
    </div>
  );
};
