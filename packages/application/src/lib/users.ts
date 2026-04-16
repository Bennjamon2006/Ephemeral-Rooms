import { randomUUID } from "crypto";
import type { User } from "shared/models";
import { usersRepository } from "infra/storage";
import { rooms } from ".";

export const getUsersInRoom = async (roomCode: string): Promise<User[]> => {
  return usersRepository.getRoomUsers(roomCode);
};

export const addUserToRoom = async (
  roomCode: string,
  username: string,
): Promise<User> => {
  const userId = randomUUID();

  const user: User = {
    id: userId,
    name: username,
  };

  await usersRepository.addUserToRoom(roomCode, user);

  await rooms.updateRoom(roomCode, false);

  return user;
};

export const checkUserInRoom = async (
  roomCode: string,
  userId: string,
  username: string,
): Promise<boolean> => {
  const user = await usersRepository.getUser(roomCode, userId);

  return user !== null && user.name === username;
};
