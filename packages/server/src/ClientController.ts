import { messages } from "shared/messaging";
import Client from "./Client";
import ClientsHub from "./ClientsHub";
import { RoomsUseCases, UsersUseCases } from "application/use-cases";

export default class ClientController {
  private readonly cleanupFunctions: (() => void)[] = [];

  constructor(
    private readonly client: Client,
    private readonly roomsUseCases: RoomsUseCases,
    private readonly usersUseCases: UsersUseCases,
  ) {}

  public bindHandlers(hub: ClientsHub) {
    this.client.on("watchRoomData", async () => {
      const cleanup = await this.roomsUseCases.watchRoomData(
        this.client.roomCode,
        (roomState) => {
          this.client.send(new messages.events.roomDataUpdated({ roomState }));
        },
      );

      this.cleanupFunctions.push(cleanup);
    });

    this.client.on("auth", async (message) => {
      const { userId } = message.payload;

      this.client.setUserId(userId);

      await this.usersUseCases.setUserOnline(this.client.roomCode, userId);

      hub.broadcastMessage(
        new messages.events.userJoined({ userId }),
        (client) =>
          client.roomCode === this.client.roomCode && client !== this.client,
      );
    });

    this.client.on("watchUserCreated", async () => {
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
    });

    this.client.onClose(async () => {
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
    });
  }
}
