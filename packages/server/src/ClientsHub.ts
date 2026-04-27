import { Envelope } from "shared/messaging";
import Client from "./Client.js";
import ClientController from "./ClientController.js";
import createContainer from "./container/index.js";
import { ClientMessages } from "application/messaging";

type ResolveClientMessageType<T extends keyof ClientMessages> =
  ClientMessages[T] extends new (...args: any[]) => infer R
    ? R extends Envelope<any, any>
      ? R
      : never
    : never;

export default class ClientsHub {
  private readonly clients: Set<Client> = new Set();
  private readonly controllers: Map<Client, ClientController> = new Map();

  public async addClient(client: Client) {
    console.log("New client added", client.userId, client.roomCode);

    const container = await createContainer();

    this.clients.add(client);
    const controller = new ClientController(
      client,
      container.roomsUseCases,
      container.usersUseCases,
      container.messagesUseCases,
    );

    controller.bindHandlers(this);

    this.controllers.set(client, controller);
  }

  public removeClient(client: Client) {
    this.clients.delete(client);
    this.controllers.delete(client);
  }

  public broadcastMessage(
    message: ResolveClientMessageType<keyof ClientMessages>,
    filter?: (client: Client) => boolean,
  ) {
    for (const client of this.clients) {
      if (!filter || filter(client)) {
        client.send(message);
      }
    }
  }
}
