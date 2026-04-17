import { RedisProvider } from "infra/redis";

const globalForRedis = globalThis as unknown as {
  redisProvider?: RedisProvider;
  redisProviderPromise?: Promise<void>;
};

export default async function getRedisProvider(): Promise<RedisProvider> {
  if (globalForRedis.redisProvider) {
    return globalForRedis.redisProvider;
  }

  if (!globalForRedis.redisProviderPromise) {
    const redisProvider = new RedisProvider();

    globalForRedis.redisProviderPromise = redisProvider
      .connect()
      .then(() => {
        globalForRedis.redisProvider = redisProvider;
      })
      .catch((error) => {
        console.error("Failed to connect to Redis:", error);
        throw error;
      });
  }

  await globalForRedis.redisProviderPromise;

  return globalForRedis.redisProvider!;
}
