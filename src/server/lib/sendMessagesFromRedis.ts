import { Socket } from "socket.io";
import { redis } from "./redis";
import logger from "@/utils/socket/logger";

export function sendMessagesFromRedis(socket: Socket, clientName: string) {
  redis.lrange("messages", -20, -1).then((messages) => {
    logger.info(
      `Client ${clientName} IP: ${socket.handshake.address} send messages: ${messages}`
    );

    socket.on("ready", () => {
      messages.forEach((message) => {
        socket.emit("message", message);
      });
    });
  });
}
