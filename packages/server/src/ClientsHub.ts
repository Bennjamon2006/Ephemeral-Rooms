import Client from "./Client.js";
import ClientController from "./ClientController.js";
import { MessagesMap } from "shared/messaging";
import createContainer from "./container/index.js";

type ClientMessage = {
  [K in keyof MessagesMap["client"]]: InstanceType<MessagesMap["client"][K]>;
};

export default class ClientsHub {
  private readonly clients: Set<Client> = new Set();
  private readonly controllers: Map<Client, ClientController> = new Map();

  public async addClient(client: Client) {
    console.log("New client added", client.userId, client.roomCode);

    const container = await createContainer();

    this.clients.add(client);
    const controller = new ClientController(client, container.roomsUseCases);

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
      client.on(messageType, (message) =>
        handler(message as ClientMessage[K], client),
      );
    }
  }

  public offMessage<K extends keyof ClientMessage>(
    messageType: K,
    handler: (message: ClientMessage[K], client: Client) => void,
  ) {
    for (const client of this.clients) {
      client.off(messageType, (message) =>
        handler(message as ClientMessage[K], client),
      );
    }
  }

  public stopAll() {
    for (const client of this.clients) {
      client.stop();
    }
  }
}
