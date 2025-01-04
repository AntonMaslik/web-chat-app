import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import logger from "@/utils/socket/logger";
import { sendMessagesFromRedis } from "./lib/sendMessagesFromRedis";
import { setClientOnServer } from "./lib/setClientOnServer";
import { saveMessageInRedis } from "./lib/saveMessageInRedis";
import { sendMessageAllClients } from "./lib/sendMessagesAllClients";

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

    sendMessagesFromRedis(socket, clientRandomName);

    setClientOnServer(socket, clientRandomName, clients);

    socket.on("message", (message) => {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === "message" && parsedMessage.content) {
        const message = {
          userId: socket.id,
          from: clientRandomName,
          content: parsedMessage.content,
          timestamp: new Date().toISOString(),
        };

        saveMessageInRedis(JSON.stringify(message));

        logger.info(`Save message from ${clientRandomName} in database`);

        sendMessageAllClients(clients, message, clientRandomName);
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
