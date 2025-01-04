import { Socket } from "socket.io";
import logger from "@/utils/socket/logger";

export function setClientOnServer(
  socket: Socket,
  clientName: string,
  clients: Map<string, Socket>
) {
  clients.set(clientName, socket);
  logger.info(
    `Client registered: ${clientName} IP: ${socket.handshake.address}`
  );
}
