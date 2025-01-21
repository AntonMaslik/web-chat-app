### WebChat-App

#### **Project Overview**
This project is a WebSocket server built using Node.js, Next.js, and the Socket.IO library. It supports real-time communication among multiple clients with Redis as a message storage and retrieval system. The server is designed to enable efficient messaging, persistent storage of messages, and handling of client connections in a scalable manner.

---

#### **Key Features**
1. **Real-Time Messaging**:
   - Clients can send and receive messages in real time using WebSocket connections.
   - All messages are broadcast to connected clients except the sender.

2. **Redis Integration**:
   - Incoming messages are saved in a Redis datastore for persistence.
   - On a new connection, messages stored in Redis are sent to the client.

3. **Client Management**:
   - Each connected client is registered with a unique identifier.
   - Clients can register their names, which are used to track user activity.

4. **Scalability and Extensibility**:
   - Redis ensures efficient storage and retrieval of messages.
   - The modular structure makes it easy to add additional features or integrations.

---

#### **Environment Variables**
The following environment variables are required for configuring the server:
- **`NODE_ENV`**: Sets the environment (e.g., `production` or `development`).
- **`SOCKET_SERVER_HOST`**: The hostname for the server (default: `localhost`).
- **`SOCKET_SERVER_PORT`**: The port number for the server (default: `3000`).

---

#### **Project Structure**
```plaintext
├── lib/
│   ├── saveMessageInRedis.js         # Saves messages to Redis
│   ├── sendMessagesAllClients.js     # Broadcasts messages to all clients
│   ├── sendMessagesFromRedis.js      # Fetches messages from Redis on client connection
│   └── setClientOnServer.js          # Handles client registration
├── utils/
│   └── socket/logger.js              # Logger utility for debugging and tracking events
└── index.js                          # Main server entry point
```

---

#### **Core Functionalities**

1. **Server Initialization**:
   - Uses `next` for Next.js integration and `http` to create the HTTP server.
   - Listens for WebSocket connections using Socket.IO.

   ```javascript
   const httpServer = createServer(handler);
   const io = new Server(httpServer);
   ```

2. **Client Connection Handling**:
   - Each client connection is tracked in a `Map` (`clients`) with their names as keys.

   ```javascript
   io.on("connection", (socket) => { ... });
   ```

3. **Client Registration**:
   - Clients register their names by emitting a `register` event.
   - The name is stored in the `clients` map along with their socket reference.

   ```javascript
   socket.on("register", (data) => {
       setClientOnServer(socket, clientName, clients);
   });
   ```

4. **Message Handling**:
   - Clients send messages via the `message` event.
   - Messages are saved in Redis, logged, and broadcast to all connected clients.

   ```javascript
   socket.on("message", (message) => {
       saveMessageInRedis(JSON.stringify(message));
       sendMessageAllClients(clients, message, clientName);
   });
   ```

5. **Redis Message Retrieval**:
   - When a client connects, all previously saved messages are fetched from Redis and sent to the client.

   ```javascript
   sendMessagesFromRedis(socket);
   ```

6. **Disconnection Handling**:
   - When a client disconnects, their name is removed from the `clients` map, and the disconnection is logged.

   ```javascript
   socket.on("disconnect", () => {
       clients.delete(clientName);
   });
   ```

---

#### **Modules**

1. **`saveMessageInRedis`**:
   - Saves a serialized message object to the Redis database.

2. **`sendMessagesFromRedis`**:
   - Retrieves stored messages from Redis and sends them to the connected client.

3. **`sendMessagesAllClients`**:
   - Broadcasts a message to all connected clients except the sender.

4. **`setClientOnServer`**:
   - Adds the client to the `clients` map with their registered name.

5. **Logger Utility**:
   - Logs server events, client connections, disconnections, and errors for debugging.

---

#### **Setup Instructions**

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the project root:
     ```plaintext
     NODE_ENV=development
     SOCKET_SERVER_HOST=localhost
     SOCKET_SERVER_PORT=3000
     ```

4. **Run the Server**:
   ```bash
   npm run dev
   ```

5. **Access the Server**:
   - Open a browser or WebSocket client and connect to:
     ```
     http://localhost:3000
     ```

---

#### **Future Enhancements**
- Add authentication to validate clients before they can register or send messages.
- Implement message expiry in Redis to manage storage effectively.
- Scale the application horizontally with Redis Pub/Sub for distributed systems.
- Add support for private messaging between specific clients.
