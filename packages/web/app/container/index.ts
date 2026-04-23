import { UsersUseCases, RoomsUseCases } from "application/use-cases";
import {
  RedisUsersRepository,
  RedisRoomsRepository,
  RedisRoomContextFactory,
  RedisMessageTransporter,
} from "infra/redis";
import getRedisProvider from "./redis";
import { MessageRouter } from "application/messaging";

type Container = {
  usersUseCases: UsersUseCases;
  roomsUseCases: RoomsUseCases;
};

export default async function createContainer(): Promise<Container> {
  const redisProvider = await getRedisProvider();

  await RedisMessageTransporter.setup(redisProvider);

  const systemMessageTransporter =
    await RedisMessageTransporter.create("system");
  const systemMessageRouter = new MessageRouter(
    systemMessageTransporter,
    "system",
  );

  const usersRepository = new RedisUsersRepository(redisProvider);
  const roomsRepository = new RedisRoomsRepository(redisProvider);
  const roomContextFactory = new RedisRoomContextFactory(redisProvider);

  const roomsUseCases = new RoomsUseCases(
    roomsRepository,
    roomContextFactory,
    systemMessageRouter,
  );
  const usersUseCases = new UsersUseCases(
    usersRepository,
    roomsUseCases,
    roomContextFactory,
    systemMessageRouter,
  );

  await usersUseCases.init();

  return {
    usersUseCases,
    roomsUseCases,
  };
}
