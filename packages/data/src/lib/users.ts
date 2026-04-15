import { randomUUID } from "crypto";
import type { User } from "shared";
import { useRedisClient } from "../redisClient";
import { rooms } from ".";

export const getUsersInRoom = async (roomCode: string): Promise<User[]> => {
  const redis = await useRedisClient();

  const usersData = await redis.hGetAll(`room:${roomCode}:users`);

  return Object.values(usersData).map(
    (userData) => JSON.parse(userData) as User,
  );
};

export const addUserToRoom = async (roomCode: string, user: User) => {
  const redis = await useRedisClient();

  const id = randomUUID();

  const result = await redis.hSetNX(
    `room:${roomCode}:users`,
    id,
    JSON.stringify(user),
  );

  rooms.updateRoomData(roomCode, false); // mark room as not empty

  if (result) {
    return {
      id,
    };
  }

  throw new Error("Failed to add user to room");
};

export const checkUserInRoom = async (
  roomCode: string,
  userId: string,
  username: string,
) => {
  const redis = await useRedisClient();

  const userData = await redis.hGet(`room:${roomCode}:users`, userId);

  if (!userData) {
    return false;
  }

  const user = JSON.parse(userData) as User;

  return user.name === username;
};
