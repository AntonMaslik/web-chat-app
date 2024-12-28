import express from "express";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const httpServer = http.createServer(server);

  const wss = new WebSocketServer({ server: httpServer });

  const clients = new Map<string, WebSocket>();

  wss.on("connection", function connection(ws: WebSocket) {
    let clientId: string | null = null;

    ws.on("message", function incoming(message: string) {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === "register" && parsedMessage.clientId) {
        clientId = parsedMessage.clientId;

        if (clientId && typeof clientId === "string") {
          clients.set(clientId, ws);
          console.log(`Client registered: ${clientId}`);
        }
      }

      if (
        parsedMessage.type === "message" &&
        parsedMessage.to &&
        parsedMessage.content
      ) {
        const targetClient = clients.get(parsedMessage.to);

        if (targetClient) {
          targetClient.send(
            JSON.stringify({
              from: clientId,
              content: parsedMessage.content,
            })
          );
          console.log(
            `Message from ${clientId} to ${parsedMessage.to}: ${parsedMessage.content}`
          );
        } else {
          console.log(`Client ${parsedMessage.to} not found`);
        }
      }
    });

    ws.on("close", () => {
      if (clientId) {
        clients.delete(clientId);
        console.log(`Client disconnected: ${clientId}`);
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
