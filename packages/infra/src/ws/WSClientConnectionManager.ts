export default class WSClientConnectionManager {
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_BASE_MS = 1000;

  private socket: WebSocket | null = null;
  private connectionPromise: Promise<WebSocket> | null = null;
  private manuallyClosed = false;

  constructor(private readonly url: string) {}

  private isOpen(socket: WebSocket | null): socket is WebSocket {
    return socket?.readyState === WebSocket.OPEN;
  }

  private createSocket(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(this.url);

      let settled = false;

      socket.addEventListener(
        "open",
        () => {
          if (settled) return;
          settled = true;

          this.socket = socket;
          resolve(socket);
        },
        { once: true },
      );

      socket.addEventListener(
        "error",
        (event) => {
          if (settled) return;
          settled = true;

          reject(new Error(`WebSocket error: ${event}`));
        },
        { once: true },
      );

      socket.addEventListener("close", () => {
        if (this.socket === socket) {
          this.socket = null;
        }

        if (!this.manuallyClosed) {
          console.warn("WS closed, attempting reconnect...");
          this.reconnect(); // fire and forget
        }
      });
    });
  }

  private async connectWithRetry(): Promise<WebSocket> {
    let attempt = 0;

    while (attempt < this.MAX_RETRIES) {
      try {
        return await this.createSocket();
      } catch (err) {
        attempt++;

        const delay = this.RETRY_DELAY_BASE_MS * 2 ** (attempt - 1);

        console.warn(
          `WS connect failed (${attempt}/${this.MAX_RETRIES}), retrying in ${delay}ms...`,
        );

        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error("Max retries reached");
  }

  private reconnect() {
    if (this.connectionPromise) return; // ya hay intento en curso

    this.connectionPromise = this.connectWithRetry()
      .catch((err) => {
        console.error("Reconnect failed:", err);
        return Promise.reject(err);
      })
      .finally(() => {
        this.connectionPromise = null;
      });
  }

  public async getConnection(): Promise<WebSocket> {
    if (this.isOpen(this.socket)) {
      return this.socket;
    }

    if (!this.connectionPromise) {
      this.manuallyClosed = false;

      this.connectionPromise = this.connectWithRetry().finally(() => {
        this.connectionPromise = null;
      });
    }

    return this.connectionPromise;
  }

  public close() {
    this.manuallyClosed = true;

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
