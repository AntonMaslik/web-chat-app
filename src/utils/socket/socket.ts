"use client";

import { io } from "socket.io-client";

export const socket = io({
  host: process.env.SOCKET_SERVER_HOST || "localhost",
  port: (process.env.SOCKET_SERVER_PORT as unknown as number) || 3000,
  transports: ["websocket"],
});
