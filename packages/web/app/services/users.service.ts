import type { User } from "shared/models";
import createContainer from "../container";

const getUsersInRoom = async (roomCode: string): Promise<User[]> => {
  const { usersUseCases } = await createContainer();

  return usersUseCases.getUsersInRoom(roomCode);
};

const getOnlineUsersInRoom = async (roomCode: string): Promise<string[]> => {
  const { usersUseCases } = await createContainer();

  return usersUseCases.getOnlineUsersInRoom(roomCode);
};

const usersService = {
  getUsersInRoom,
  getOnlineUsersInRoom,
};

export default usersService;
