"use client";

import { useEffect, useState } from "react";
import { ChatWindow } from "../components/ChatWindow/ChatWindow";
import { MessageInput } from "../components/MessageInput/MessageInput";
import { socket } from "@/socket/socket";

const Home = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleMessage = (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("message", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message", handleMessage);
      socket.disconnect();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (isConnected) {
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
