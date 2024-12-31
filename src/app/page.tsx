"use client";

import { useEffect, useState } from "react";
import { ChatWindow } from "../components/ChatWindow/ChatWindow";
import { MessageInput } from "../components/MessageInput/MessageInput";
import { socket } from "@/socket/socket";

const Home = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();

    if (socket.connected) {
      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (!socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket.connected) {
      socket.send(JSON.stringify({ type: "message", content: message }));
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
