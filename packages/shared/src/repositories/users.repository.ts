import type { User } from "../models/index.js";

export default interface UsersRepository {
  getUser(roomCode: string, userId: string): Promise<User | null>;
  getRoomUsers(roomCode: string): Promise<User[]>;
  addUserToRoom(roomCode: string, user: User): Promise<void>;
  removeUserFromRoom(roomCode: string, userId: string): Promise<void>;
  setUserOnline(roomCode: string, userId: string): Promise<void>;
  getOnlineRoomUsers(roomCode: string): Promise<string[]>;
  setUserOffline(roomCode: string, userId: string): Promise<void>;
  setExpiration(roomCode: string, expiresAt: number): Promise<void>;
}
