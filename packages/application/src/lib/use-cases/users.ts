import { randomUUID } from "crypto";
import type { User } from "shared/models";
import type { UsersRepository } from "shared/repositories";
import RoomsUseCases from "./rooms.js";
import RoomContextFactory from "@/lib/interfaces/RoomContextFactory.js";
import MessageRouter from "@/lib/messaging/MessageRouter.js";

export default class UsersUseCases {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rooms: RoomsUseCases,
    private readonly roomContextFactory: RoomContextFactory,
    private readonly systemMessageRouter: MessageRouter<"system">,
  ) {}

  public async init(): Promise<void> {
    this.systemMessageRouter.on("roomDataUpdate", async (message) => {
      if (!message.payload.roomCode) {
        console.warn("Received roomDataUpdate without roomCode");
        return;
      }

      const { roomCode, roomState } = message.payload;

      await this.usersRepository.setTTLs(roomCode, roomState.expiresAt);
    });
  }

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
  }

  public async getOnlineUsersInRoom(roomCode: string): Promise<string[]> {
    return this.usersRepository.getOnlineRoomUsers(roomCode);
  }

  public async setUserOffline(roomCode: string, userId: string): Promise<void> {
    await this.usersRepository.setUserOffline(roomCode, userId);

    // Efecto secundario, no se espera
    this.getOnlineUsersInRoom(roomCode).then((onlineUsers) => {
      if (onlineUsers.length === 0) {
        this.rooms.updateRoom(roomCode, true); // Marcar la sala como inactiva si no hay usuarios en línea
      }
    });
  }

  public async syncUsersOnRoom(
    roomCode: string,
    expiresAt: Date,
  ): Promise<void> {}
}
