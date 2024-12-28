import React from "react";

interface ChatWindowProps {
  messages: string[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        height: "300px",
        overflowY: "scroll",
        marginBottom: "10px",
      }}
    >
      {messages.map((msg, index) => (
        <div key={index} style={{ margin: "5px 0" }}>
          {msg}
        </div>
      ))}
    </div>
  );
};
