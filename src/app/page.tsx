"use client";

import { useEffect, useRef, useState } from "react";
import { ChatWindow } from "../components/ChatWindow/ChatWindow";
import { MessageInput } from "../components/MessageInput/MessageInput";

const Home = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3001");

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({ type: "message", content: message })
      );
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center">Web Chat</h1>
        <ChatWindow messages={messages} />
        <MessageInput onSend={sendMessage} />
      </div>
    </main>
  );
};

export default Home;
