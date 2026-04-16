import RedisProvider from "./redis/RedisProvider";
import RedisUsersRepository from "./redis/repositories/RedisUsersRepository";
import RedisRoomsRepository from "./redis/repositories/RedisRoomsRepository";
import type { UsersRepository, RoomsRepository } from "shared/repositories";

const redisProvider = new RedisProvider();

export const usersRepository: UsersRepository = new RedisUsersRepository(
  redisProvider,
);

export const roomsRepository: RoomsRepository = new RedisRoomsRepository(
  redisProvider,
);
