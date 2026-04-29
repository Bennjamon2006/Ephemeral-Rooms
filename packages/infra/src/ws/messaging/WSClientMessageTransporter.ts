import { MessageTransporter } from "shared/messaging";
import WSClientConnectionManager from "../WSClientConnectionManager.js";

export default class WSClientMessageTransporter implements MessageTransporter {
  private readonly queue: string[] = [];
  private readonly listeners: Set<(raw: string) => void> = new Set();
  private readonly connectionManager: WSClientConnectionManager;
  private socket: WebSocket | null = null;

  constructor(url: string) {
    this.connectionManager = new WSClientConnectionManager(url);
  }

  public async prepare(): Promise<void> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.socket = await this.connectionManager.getConnection();
      this.socket.addEventListener("message", (event) => {
        for (const listener of this.listeners) {
          listener(event.data);
        }
      });

      this.socket.addEventListener("close", () => {
        console.warn("WebSocket closed, attempting reconnect...");

        this.socket = null;

        this.prepare().catch((error) => {
          console.error("Failed to re-establish WebSocket connection:", error);
        });
      });

      // Flush the queue
      while (this.queue.length > 0) {
        const message = this.queue.shift()!;
        this.socket.send(message);
      }
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error);
      throw error;
    }
  }

  public sendMessage(raw: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(raw);
    } else {
      this.queue.push(raw);
    }
  }

  public onMessage(listener: (raw: string) => void): void {
    this.listeners.add(listener);
  }

  public close(): void {
    this.connectionManager.close();
    this.socket = null;
  }
}
