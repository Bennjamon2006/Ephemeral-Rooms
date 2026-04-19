import Client from "./Client";
import ClientsHub from "./ClientsHub";

export default class ClientController {
  constructor(private readonly client: Client) {}

  public bindHandlers(hub: ClientsHub) {
    this.client.on("watchRoomData", (message) => {
      console.log(
        "Received watchRoomData message from client",
        this.client.userId,
        message,
      );
    });
  }
}
