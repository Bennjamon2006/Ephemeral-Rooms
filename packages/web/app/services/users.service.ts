import type { User } from "shared/models";
import { users } from "application";

const getUsersInRoom = async (roomCode: string): Promise<User[]> => {
  return users.getUsersInRoom(roomCode);
};

const usersService = {
  getUsersInRoom,
};

export default usersService;
