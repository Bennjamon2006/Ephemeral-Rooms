import type { User } from "shared";
import { users } from "data";

const getUsersInRoom = async (roomCode: string): Promise<User[]> => {
  return users.getUsersInRoom(roomCode);
};

const usersService = {
  getUsersInRoom,
};

export default usersService;
