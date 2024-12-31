import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { faker } from "@faker-js/faker";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: (process.env.REDIS_PORT as unknown as number) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: (process.env.REDIS_NUMBER as unknown as number) || 0,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

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
      messages.forEach((message) => {
        socket.emit("message", message);
      });
    });

    socket.on("message", (message) => {
      const parsedMessage = JSON.parse(message);

      clients.set(clientRandomName, socket);
      console.log(`Client registered: ${clientRandomName}`);

      if (parsedMessage.type === "message" && parsedMessage.content) {
        const message = {
          userId: socket.id,
          from: clientRandomName,
          content: parsedMessage.content,
          timestamp: new Date().toISOString(),
        };

        redis.rpush("messages", JSON.stringify(message));

        redis.ltrim("messages", -1000, -1);

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

    socket.on("close", () => {
      clients.delete(clientRandomName);
      console.log(`Client disconnected: ${clientRandomName}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
