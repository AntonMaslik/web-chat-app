"use client";

import { useEffect, useState } from "react";
import { ChatWindow } from "@/components/ChatWindow/ChatWindow";
import { MessageInput } from "@/components/MessageInput/MessageInput";
import { socket } from "@/utils/socket/socket";
import { useRouter } from "next/navigation";

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (socket.connected) {
      console.log("Connected to server");

      socket.emit("ready");
    } else {
      console.error("Connection to server failed");
    }

    const handleMessage = (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", handleMessage);

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const userNameFromStorage = sessionStorage.getItem("userName");

    if (userNameFromStorage) {
      setUserName(userNameFromStorage);
    } else {
      router.push("/");
    }
  }, [router]);

  const sendMessage = (message: string) => {
    if (socket.connected) {
      socket.send(
        JSON.stringify({ type: "message", userName, content: message })
      );
    } else {
      console.error("Connection is not established. Message not send.");
    }
  };

  return (
    <main className={`container mx-auto p-4`}>
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center">Web Chat</h1>
        <ChatWindow messages={messages} theme="dark" />
        <MessageInput onSend={sendMessage} />
      </div>
    </main>
  );
};

export default Chat;
