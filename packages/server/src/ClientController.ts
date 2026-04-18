import Client from "./Client";
import ClientsHub from "./ClientsHub";

export default class ClientController {
  constructor(private readonly client: Client) {}

  public bindHandlers(hub: ClientsHub) {
    this.client.on("ping", () => {
      console.log(
        "Received ping from client",
        this.client.userId,
        this.client.roomCode,
      );
    });
  }
}
