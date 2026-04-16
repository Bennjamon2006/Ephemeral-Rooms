import { createClient, RedisClientType } from "redis";

export default class RedisProvider {
  private static connectionString: string =
    process.env.REDIS_URL || "redis://localhost:6379";

  private client: RedisClientType;
  private promise?: Promise<void>;

  constructor(connectionString: string = RedisProvider.connectionString) {
    this.client = createClient({ url: connectionString });
  }

  public async connect(): Promise<void> {
    if (this.promise) {
      await this.promise;
      return;
    }

    if (!this.client.isOpen) {
      this.promise = this.client
        .connect()
        .then(() => {
          console.log("Connected to Redis");
        })
        .catch((err) => {
          console.error("Failed to connect to Redis", err);
          throw err;
        })
        .finally(() => {
          this.promise = undefined;
        });
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      this.client.quit();
    }
  }

  public async getClient(): Promise<RedisClientType> {
    await this.connect();
    return this.client;
  }
}
