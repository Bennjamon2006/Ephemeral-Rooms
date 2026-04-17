import { WebSocket, ErrorEvent } from "ws";
import { MessageTransporter } from "shared/messaging";

export default class WSServerMessageTransporter implements MessageTransporter {
  private readonly queue: string[] = [];
  private isReady = false;
  private promise: Promise<void> | null = null;

  private onOpen?: () => void;
  private onError?: (err: ErrorEvent) => void;
  private onClose?: () => void;

  constructor(private readonly socket: WebSocket) {}

  private cleanUpListeners() {
    if (this.onOpen) {
      this.socket.removeEventListener("open", this.onOpen);
    }

    if (this.onError) {
      this.socket.removeEventListener("error", this.onError);
    }

    if (this.onClose) {
      this.socket.removeEventListener("close", this.onClose);
    }

    this.socket.removeAllListeners("message");
  }

  private async waitConnection(): Promise<void> {
    if (this.isReady) {
      return;
    }

    if (this.promise) {
      return this.promise;
    }

    this.promise = new Promise((resolve, reject) => {
      this.onOpen = () => {
        this.isReady = true;
        resolve();
      };

      this.onError = (err) => {
        reject(err);
      };

      this.onClose = () => {
        this.isReady = false;
      };

      this.socket.addEventListener("open", this.onOpen);
      this.socket.addEventListener("error", this.onError);
      this.socket.addEventListener("close", this.onClose);
    });

    return this.promise;
  }

  private flushQueue(): void {
    this.queue.forEach((raw) => this.send(raw));
    this.queue.length = 0;
  }

  public async prepare(): Promise<void> {
    try {
      await this.waitConnection();

      if (this.isReady) {
        this.flushQueue();
      }
    } catch (err) {
      console.error("Error occurred while preparing message transporter:", err);
    }

    this.cleanUpListeners();
    this.promise = null;
  }

  public close(): void {
    this.socket.close();
    this.cleanUpListeners();
  }

  private send(raw: string): void {
    this.socket.send(raw);
  }

  public sendMessage(raw: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.send(raw);
    } else {
      this.queue.push(raw);
    }
  }

  public onMessage(handler: (raw: string) => void): void {
    this.socket.addEventListener("message", (event) => {
      if (typeof event.data === "string") {
        handler(event.data);
      } else {
        console.warn("Received non-string message, ignoring");
      }
    });
  }
}
