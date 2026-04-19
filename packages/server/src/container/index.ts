import { UsersUseCases, RoomsUseCases } from "application/use-cases";
import {
  RedisUsersRepository,
  RedisRoomsRepository,
  RedisRoomContextFactory,
  RedisMessageTransporter,
} from "infra/redis";
import getRedisProvider from "./redis";

type Container = {
  usersUseCases: UsersUseCases;
  roomsUseCases: RoomsUseCases;
};

export default async function createContainer(): Promise<Container> {
  const redisProvider = await getRedisProvider();

  await RedisMessageTransporter.setup(redisProvider);

  const usersRepository = new RedisUsersRepository(redisProvider);
  const roomsRepository = new RedisRoomsRepository(redisProvider);
  const roomContextFactory = new RedisRoomContextFactory(redisProvider);

  const roomsUseCases = new RoomsUseCases(roomsRepository, roomContextFactory);
  const usersUseCases = new UsersUseCases(usersRepository, roomsUseCases);

  return {
    usersUseCases,
    roomsUseCases,
  };
}
