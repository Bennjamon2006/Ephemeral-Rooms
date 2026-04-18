import { WebSocketServer } from "ws";
import Server from "./Server.js";

const wss = new WebSocketServer({ port: 3001 });

const server = new Server(wss);

server.start();

console.log("WebSocket server is running on ws://localhost:3001");
