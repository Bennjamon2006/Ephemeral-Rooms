import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {});

console.log("WebSocket server is running on ws://localhost:3001");
