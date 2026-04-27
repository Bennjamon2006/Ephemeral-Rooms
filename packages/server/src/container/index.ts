import {
  UsersUseCases,
  RoomsUseCases,
  MessagesUseCases,
} from "application/use-cases";
import {
  RedisUsersRepository,
  RedisRoomsRepository,
  RedisRoomContextFactory,
  RedisMessageTransporter,
  RedisMessagesRepository,
} from "infra/redis";
import getRedisProvider from "./redis.js";
import { MessageRouter } from "application/messaging";

type Container = {
  usersUseCases: UsersUseCases;
  roomsUseCases: RoomsUseCases;
  messagesUseCases: MessagesUseCases;
};

const globalWithContainer = globalThis as typeof globalThis & {
  container?: Container;
};

export default async function createContainer(): Promise<Container> {
  if (globalWithContainer.container) {
    return globalWithContainer.container;
  }

  const redisProvider = await getRedisProvider();

  await RedisMessageTransporter.setup(redisProvider);

  const systemMessageTransporter =
    await RedisMessageTransporter.create("system:internal");
  const systemMessageRouter = new MessageRouter(
    systemMessageTransporter,
    "system",
  );

  await systemMessageRouter.start();

  const usersRepository = new RedisUsersRepository(redisProvider);
  const roomsRepository = new RedisRoomsRepository(redisProvider);
  const messagesRepository = new RedisMessagesRepository(redisProvider);
  const roomContextFactory = new RedisRoomContextFactory(redisProvider);

  const roomsUseCases = new RoomsUseCases(
    roomsRepository,
    roomContextFactory,
    systemMessageRouter,
  );
  const usersUseCases = new UsersUseCases(
    usersRepository,
    roomContextFactory,
    systemMessageRouter,
  );
  const messagesUseCases = new MessagesUseCases(messagesRepository);
  await roomsUseCases.init();
  await usersUseCases.init();

  const container = {
    usersUseCases,
    roomsUseCases,
    messagesUseCases,
  };

  globalWithContainer.container = container;

  return container;
}
