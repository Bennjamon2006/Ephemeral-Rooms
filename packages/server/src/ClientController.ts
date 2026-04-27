import { messages } from "shared/messaging";
import Client from "./Client.js";
import ClientsHub from "./ClientsHub.js";
import {
  MessagesUseCases,
  RoomsUseCases,
  UsersUseCases,
} from "application/use-cases";

export default class ClientController {
  private readonly cleanupFunctions: (() => void)[] = [];

  constructor(
    private readonly client: Client,
    private readonly roomsUseCases: RoomsUseCases,
    private readonly usersUseCases: UsersUseCases,
    private readonly messagesUseCases: MessagesUseCases,
  ) {}

  public bindHandlers(hub: ClientsHub) {
    this.client.on("watchRoomData", this.watchRoomData.bind(this));

    this.client.on("auth", (message) => {
      const { userId } = message.payload;
      this.authenticate(userId, hub);
    });

    this.client.on("watchUserCreated", this.watchUserCreated.bind(this));
    this.client.on("syncUsers", this.syncUsers.bind(this));

    this.client.on("syncOnlineUsers", this.syncOnlineUsers.bind(this));

    this.client.on("sendMessage", (message) => {
      const { content } = message.payload;
      this.sendMessage(content, hub);
    });

    this.client.onClose(() => this.onClose(hub));
  }

  private async watchRoomData() {
    const cleanup = await this.roomsUseCases.watchRoomData(
      this.client.roomCode,
      (roomState) => {
        this.client.send(new messages.events.roomDataUpdated({ roomState }));
      },
    );

    this.cleanupFunctions.push(cleanup);
  }

  public async authenticate(userId: string, hub: ClientsHub) {
    this.client.setUserId(userId);

    await this.usersUseCases.setUserOnline(this.client.roomCode, userId);

    hub.broadcastMessage(
      new messages.events.userJoined({ userId }),
      (client) =>
        client.roomCode === this.client.roomCode && client !== this.client,
    );
  }

  private async watchUserCreated() {
    const cleanup = await this.usersUseCases.watchUserCreated(
      this.client.roomCode,
      (user) => {
        this.client.send(
          new messages.events.userCreated({
            user,
          }),
        );
      },
    );

    this.cleanupFunctions.push(cleanup);
  }

  private async syncUsers() {
    const users = await this.usersUseCases.getUsersInRoom(this.client.roomCode);

    this.client.send(new messages.events.syncUsersResult({ users }));
  }

  private async syncOnlineUsers() {
    const onlineUsers = await this.usersUseCases.getOnlineUsersInRoom(
      this.client.roomCode,
    );

    this.client.send(
      new messages.events.syncOnlineUsersResult({ onlineUsers }),
    );
  }

  private async sendMessage(content: string, hub: ClientsHub) {
    if (!this.client.userId) {
      return;
    }

    const message = await this.messagesUseCases.addMessage(
      this.client.roomCode,
      content,
      this.client.userId,
    );
  }

  private async onClose(hub: ClientsHub) {
    this.cleanupFunctions.forEach((fn) => fn());

    const userId = this.client.userId;

    if (userId) {
      await this.usersUseCases.setUserOffline(this.client.roomCode, userId);

      hub.broadcastMessage(
        new messages.events.userLeft({ userId }),
        (client) =>
          client.roomCode === this.client.roomCode && client !== this.client,
      );
    }
  }
}
