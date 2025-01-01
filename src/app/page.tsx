"use client";

import { useEffect, useState } from "react";
import { ChatWindow } from "../components/ChatWindow/ChatWindow";
import { MessageInput } from "../components/MessageInput/MessageInput";
import { socket } from "@/socket/socket";

const Home = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();

    if (socket.connected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }

    const handleMessage = (message: string) => {
      setNewMessage(true);
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage(false);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [isConnected, newMessage]);

  const sendMessage = (message: string) => {
    if (socket.connected) {
      socket.send(JSON.stringify({ type: "message", content: message }));
    } else {
      console.error("Соединение не установлено. Сообщение не отправлено.");
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
