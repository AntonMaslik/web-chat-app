"use client";

import { useEffect, useState } from "react";
import { ChatWindow } from "../components/ChatWindow/ChatWindow";
import { MessageInput } from "../components/MessageInput/MessageInput";
import { socket } from "@/utils/socket/socket";

const Home = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();

    if (socket.connected) {
      console.log("Connected to server");
    } else {
      console.error("Connection to server failed");
    }

    const handleMessage = (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket.connected) {
      socket.send(JSON.stringify({ type: "message", content: message }));
    } else {
      console.error("Connection is not established. Message not send.");
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
