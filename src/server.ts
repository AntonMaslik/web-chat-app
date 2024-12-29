import express from "express";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import next from "next";
import { faker } from "@faker-js/faker";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const httpServer = http.createServer(server);

  const wss = new WebSocketServer({ server: httpServer });

  const clients = new Map<string, WebSocket>();

  wss.on("connection", function connection(ws: WebSocket) {
    const clientRandomName = faker.person.firstName();

    ws.on("message", function incoming(message: string) {
      const parsedMessage = JSON.parse(message);

      clients.set(clientRandomName, ws);
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

    ws.on("close", () => {
      if (clientRandomName) {
        clients.delete(clientRandomName);
        console.log(`Client disconnected: ${clientRandomName}`);
      }
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3001, () => {
    const serverAddress = httpServer.address();

    if (serverAddress && typeof serverAddress !== "string") {
      console.log(
        `> Ready on ws://${serverAddress.address}:${serverAddress.port}`
      );
    }
  });
});
