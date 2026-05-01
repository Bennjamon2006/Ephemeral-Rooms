import http from "http";
import { WebSocketServer } from "ws";
import Server from "./Server.js";

const PORT = process.env.PORT || 3001;

const httpServer = http.createServer();

const wss = new WebSocketServer({ server: httpServer });

const server = new Server(wss);

server.start();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
