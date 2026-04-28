import { randomUUID } from "crypto";
import type { User } from "shared/models";
import type { UsersRepository } from "shared/repositories";
import RoomContextFactory from "@/lib/interfaces/RoomContextFactory.js";
import MessageRouter from "@/lib/messaging/MessageRouter.js";
import { messages } from "shared/messaging";

export default class UsersUseCases {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly roomContextFactory: RoomContextFactory,
    private readonly systemMessageRouter: MessageRouter<"system">,
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

    const roomContext = await this.roomContextFactory.create(roomCode);

    roomContext.sendUserCreated(user);

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

  public async watchUserCreated(
    roomCode: string,
    callback: (user: User) => void,
  ): Promise<() => void> {
    const roomContext = await this.roomContextFactory.create(roomCode);

    return roomContext.onUserCreated((payload) => {
      callback(payload.user);
    });
  }

  public async setUserOnline(roomCode: string, userId: string): Promise<void> {
    await this.usersRepository.setUserOnline(roomCode, userId);

    this.systemMessageRouter.send(
      new messages.commands.updateRoom({ empty: false, roomCode }),
    );
  }

  public async getOnlineUsersInRoom(roomCode: string): Promise<string[]> {
    return this.usersRepository.getOnlineRoomUsers(roomCode);
  }

  public async setUserOffline(roomCode: string, userId: string): Promise<void> {
    await this.usersRepository.setUserOffline(roomCode, userId);

    const onlineUsers = await this.usersRepository.getOnlineRoomUsers(roomCode);

    if (onlineUsers.length === 0) {
      this.systemMessageRouter.send(
        new messages.commands.updateRoom({ empty: true, roomCode }),
      );
    }
  }
}
