import type { User } from "shared/models";
import createContainer from "../container";

const getUsersInRoom = async (roomCode: string): Promise<User[]> => {
  const { usersUseCases } = await createContainer();

  return usersUseCases.getUsersInRoom(roomCode);
};

const usersService = {
  getUsersInRoom,
};

export default usersService;
