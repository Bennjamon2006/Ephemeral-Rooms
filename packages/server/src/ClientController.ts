import { messages } from "shared/messaging";
import Client from "./Client";
import ClientsHub from "./ClientsHub";
import { RoomsUseCases } from "application/use-cases";

export default class ClientController {
  constructor(
    private readonly client: Client,
    private readonly roomsUseCases: RoomsUseCases,
  ) {}

  public bindHandlers(hub: ClientsHub) {
    this.client.on("watchRoomData", (message) => {
      const { roomCode } = message.payload;

      this.roomsUseCases.watchRoomData(roomCode, (roomState) => {
        this.client.send(new messages.client.roomUpdate({ roomState }));
      });
    });
  }
}
