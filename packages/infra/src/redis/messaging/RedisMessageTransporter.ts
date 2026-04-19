import { MessageTransporter } from "shared/messaging";
import RedisConsumer from "../RedisConsumer.js";
import { RedisClientType } from "redis";
import RedisProvider from "../RedisProvider.js";

export default class RedisMessageTransporter
  extends RedisConsumer
  implements MessageTransporter
{
  private static provider: RedisProvider;

  public static async setup(provider: RedisProvider): Promise<void> {
    if (this.provider)
      throw new Error("RedisMessageTransporter provider already set");

    await provider.connect();

    this.provider = provider;
  }

  public static async create(
    channel: string,
  ): Promise<RedisMessageTransporter> {
    if (!this.provider)
      throw new Error("RedisMessageTransporter provider not set");

    const transporter = new RedisMessageTransporter(this.provider, channel);
    await transporter.prepare();

    return transporter;
  }

  private pubClient?: RedisClientType;
  private subClient?: RedisClientType;
  private listeners: Set<(raw: string) => void> = new Set();
  private queue: string[] = [];

  private constructor(
    provider: RedisProvider,
    private channel: string,
  ) {
    super(provider);
  }

  public async prepare(): Promise<void> {
    try {
      this.pubClient = await this.getClient();
      this.subClient = this.pubClient.duplicate();

      await this.subClient.subscribe(this.channel, (message) => {
        this.listeners.forEach((handler) => handler(message));
      });

      this.queue.forEach((msg) => this.sendMessage(msg));
      this.queue = [];
    } catch (error) {
      console.error("Error preparing RedisMessageTransporter:", error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (this.pubClient) {
      await this.pubClient.quit();
    }

    if (this.subClient) {
      await this.subClient.unsubscribe(this.channel);
      await this.subClient.quit();
    }
  }

  public onMessage(handler: (raw: string) => void): void {
    this.listeners.add(handler);
  }

  public sendMessage(raw: string): void {
    if (this.pubClient) {
      this.pubClient.publish(this.channel, raw);
    } else {
      this.queue.push(raw);
    }
  }
}
