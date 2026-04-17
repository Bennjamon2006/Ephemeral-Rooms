import { RedisClientType } from "redis";
import RedisProvider from "./RedisProvider";

export default abstract class RedisConsumer {
  constructor(private readonly provider: RedisProvider) {}

  protected async getClient(): Promise<RedisClientType> {
    return this.provider.getClient();
  }
}
