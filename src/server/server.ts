import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { redis } from "./lib/redis";
import logger from "@/utils/socket/logger";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.SOCKET_SERVER_HOST || "localhost";
const port = (process.env.SOCKET_SERVER_PORT as unknown as number) || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const clients = new Map();

  io.on("connection", (socket) => {
    const clientRandomName = faker.person.firstName();

    redis.lrange("messages", -20, -1).then((messages) => {
      logger.info(
        `Client ${clientRandomName} IP: ${socket.handshake.address} send messages: ${messages}`
      );

      messages.forEach((message) => {
        socket.emit("message", message);
      });
    });

    socket.on("message", (message) => {
      const parsedMessage = JSON.parse(message);

      clients.set(clientRandomName, socket);
      logger.info(
        `Client registered: ${clientRandomName} IP: ${socket.handshake.address}`
      );

      if (parsedMessage.type === "message" && parsedMessage.content) {
        const message = {
          userId: socket.id,
          from: clientRandomName,
          content: parsedMessage.content,
          timestamp: new Date().toISOString(),
        };

        redis.rpush("messages", JSON.stringify(message));

        redis.ltrim("messages", -1000, -1);

        logger.info(`Save message from ${clientRandomName} in database`);

        for (const [, client] of clients) {
          client.send(
            JSON.stringify({
              from: clientRandomName,
              content: parsedMessage.content,
            })
          );
        }
      }
    });

    socket.on("disconnect", () => {
      clients.delete(clientRandomName);
      logger.info(
        `Client disconnected: ${clientRandomName} IP: ${socket.handshake.address}`
      );
    });
  });

  httpServer
    .once("error", (err) => {
      logger.error("Error http-server", err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      logger.info(`Server ready on http://${hostname}:${port}`);
    });
});
