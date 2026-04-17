import { UsersUseCases, RoomsUseCases } from "application/use-cases";
import { RedisUsersRepository, RedisRoomsRepository } from "infra/redis";
import getRedisProvider from "./redis";

type Container = {
  usersUseCases: UsersUseCases;
  roomsUseCases: RoomsUseCases;
};

export default async function createContainer(): Promise<Container> {
  const redisProvider = await getRedisProvider();

  const usersRepository = new RedisUsersRepository(redisProvider);
  const roomsRepository = new RedisRoomsRepository(redisProvider);

  const roomsUseCases = new RoomsUseCases(roomsRepository);
  const usersUseCases = new UsersUseCases(usersRepository, roomsUseCases);

  return {
    usersUseCases,
    roomsUseCases,
  };
}
