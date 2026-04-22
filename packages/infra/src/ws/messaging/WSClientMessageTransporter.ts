import { messages, MessageTransporter } from "shared/messaging";

export default class WSClientMessageTransporter implements MessageTransporter {
  private readonly queue: string[] = [];
  private promise: Promise<void> | null = null;
  private listeners: Set<(event: MessageEvent) => void> = new Set();

  private onError?: (err: ErrorEvent) => void;

  constructor(private readonly socket: WebSocket) {}

  get isReady(): boolean {
    return this.socket.readyState === WebSocket.OPEN;
  }

  private cleanUpListeners() {
    if (this.onError) {
      this.socket.removeEventListener("error", this.onError);
    }

    this.listeners.forEach((listener) => {
      this.socket.removeEventListener("message", listener);
    });
  }

  private async poll(interval: number): Promise<void> {
    while (!this.isReady) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  private async waitConnection(): Promise<void> {
    if (this.isReady) {
      return;
    }

    if (this.promise) {
      return this.promise;
    }

    this.promise = new Promise((resolve, reject) => {
      this.onError = (err) => {
        reject(err);
      };

      this.socket.addEventListener("error", this.onError);

      this.poll(100)
        .then(() => {
          resolve();
        })
        .catch(reject);
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
    const messageListener = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        handler(event.data);
      } else {
        console.warn("Received non-string message, ignoring");
      }
    };

    this.socket.addEventListener("message", messageListener);

    this.listeners.add(messageListener);
  }
}
