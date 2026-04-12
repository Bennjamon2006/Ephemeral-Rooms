import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.send(
    JSON.stringify({
      event: "welcome",
      data: "Welcome to the WebSocket server!",
    }),
  );

  ws.on("message", (message) => {
    console.log("Received message:", message.toString());

    // Echo the message back to the client
    ws.send(JSON.stringify({ event: "echo", data: message.toString() }));
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:3001");
