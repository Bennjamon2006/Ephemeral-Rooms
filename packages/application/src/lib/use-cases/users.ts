import { randomUUID } from "crypto";
import type { User } from "shared/models";
import type { UsersRepository } from "shared/repositories";
import type MessageRouter from "../messaging/MessageRouter.js";
import RoomsUseCases from "./rooms.js";

export default class UsersUseCases {
  constructor(
    private usersRepository: UsersRepository,
    private rooms: RoomsUseCases,
  ) {}

  public async getUsersInRoom(roomCode: string): Promise<User[]> {
    return this.usersRepository.getRoomUsers(roomCode);
  }

  public async addUserToRoom(
    roomCode: string,
    username: string,
  ): Promise<User> {
    const userId = randomUUID();

    const user: User = {
      id: userId,
      name: username,
    };

    await this.usersRepository.addUserToRoom(roomCode, user);

    await this.rooms.updateRoom(roomCode, false);

    return user;
  }

  public async checkUserInRoom(
    roomCode: string,
    userId: string,
    username: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.getUser(roomCode, userId);

    return user !== null && user.name === username;
  }
}
