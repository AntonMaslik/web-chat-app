import { Socket } from "socket.io";

export function sendMessageAllClients(
  clients: Map<string, Socket>,
  message: { content: string },
  clientName: string
) {
  clients.forEach((client) => {
    client.send(
      JSON.stringify({
        from: clientName,
        content: message.content,
      })
    );
  });
}
