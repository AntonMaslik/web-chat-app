import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { faker } from "@faker-js/faker";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const clients = new Map();

  io.on("connection", (socket) => {
    const clientRandomName = faker.person.firstName();

    socket.on("message", (message) => {
      const parsedMessage = JSON.parse(message);

      clients.set(clientRandomName, socket);
      console.log(`Client registered: ${clientRandomName}`);

      if (parsedMessage.type === "message" && parsedMessage.content) {
        const targetClients = clients;

        for (const [, client] of targetClients) {
          client.send(
            JSON.stringify({
              from: clientRandomName,
              content: parsedMessage.content,
            })
          );
          console.log(
            `Message from ${clientRandomName} to all: ${parsedMessage.content}`
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
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
