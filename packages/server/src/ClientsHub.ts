import Client, { ClientMessage } from "./Client.js";
import ClientController from "./ClientController.js";

export default class ClientsHub {
  private readonly clients: Set<Client> = new Set();
  private readonly controllers: Map<Client, ClientController> = new Map();

  public addClient(client: Client) {
    console.log("New client added", client.userId, client.roomCode);

    this.clients.add(client);
    const controller = new ClientController(client);

    controller.bindHandlers(this);

    this.controllers.set(client, controller);
  }

  public removeClient(client: Client) {
    this.clients.delete(client);
    this.controllers.delete(client);
  }

  public broadcastMessage(
    message: ClientMessage[keyof ClientMessage],
    filter?: (client: Client) => boolean,
  ) {
    for (const client of this.clients) {
      if (!filter || filter(client)) {
        client.send(message);
      }
    }
  }

  public onMessage<K extends keyof ClientMessage>(
    messageType: K,
    handler: (message: ClientMessage[K], client: Client) => void,
  ) {
    for (const client of this.clients) {
      client.on(messageType, (message) => handler(message, client));
    }
  }

  public offMessage<K extends keyof ClientMessage>(
    messageType: K,
    handler: (message: ClientMessage[K], client: Client) => void,
  ) {
    for (const client of this.clients) {
      client.off(messageType, (message) => handler(message, client));
    }
  }

  public stopAll() {
    for (const client of this.clients) {
      client.stop();
    }
  }
}
