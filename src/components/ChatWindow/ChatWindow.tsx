import React, { useEffect, useRef } from "react";
import { MessageAlert } from "../MessageAlert/MessageAlert";

interface ChatWindowProps {
  messages: string[];
  theme: "dark" | "light";
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, theme }) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="border border-gray-300 p-4 h-[80vh] overflow-y-auto mb-4 overflow-y-scroll rounded-lg shadow-sm scrollbar-custom scroll-smooth">
      {messages.map((msg, index) => {
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(msg);
        } catch (error: unknown) {
          if (error instanceof SyntaxError) {
            console.error("Failed to parse message:", msg, error.message);
          } else {
            console.error("Unexpected error:", error);
          }
          return null;
        }
        return (
          <MessageAlert
            theme={theme}
            key={index}
            name={parsedMessage.from}
            message={parsedMessage.content}
          />
        );
      })}
      <div ref={chatEndRef} />
    </div>
  );
};
