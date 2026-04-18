import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "node:http";
import ClientFactory from "./ClientFactory.js";
import ClientsHub from "./ClientsHub.js";

export default class Server {
  private clientsHub: ClientsHub;

  constructor(private readonly wss: WebSocketServer) {
    this.clientsHub = new ClientsHub();
  }

  private async handleConnection(ws: WebSocket, req: IncomingMessage) {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const queryParams = url.searchParams;

    if (!queryParams.has("roomCode")) {
      ws.close(1008, "Missing room code");
      return;
    }

    const roomCode = queryParams.get("roomCode") as string;
    const client = ClientFactory.fromWebSocket(ws, roomCode);

    try {
      await client.start();

      ws.on("close", () => {
        this.clientsHub.removeClient(client);
        client.stop();
      });

      this.clientsHub.addClient(client);
    } catch (error) {
      console.error("Error initializing client:", error);
      ws.close(1011, "Error initializing client");
    }
  }

  public start() {
    this.wss.on("connection", this.handleConnection.bind(this));
  }

  public stop() {
    this.wss.close();
  }
}
