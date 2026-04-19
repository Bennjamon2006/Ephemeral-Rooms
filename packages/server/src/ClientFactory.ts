import { WebSocket } from "ws";
import { MessageRouter } from "application/messaging";
import { WSServerMessageTransporter } from "infra/ws";
import Client from "./Client.js";

export default class ClientFactory {
  public static fromWebSocket(ws: WebSocket, roomCode: string): Client {
    const transporter = new WSServerMessageTransporter(ws);
    const router = new MessageRouter(transporter, "client");

    return new Client(router, roomCode);
  }
}
