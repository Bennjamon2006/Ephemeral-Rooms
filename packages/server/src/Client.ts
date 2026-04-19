import { MessageRouter } from "application/messaging";
import { messages } from "shared/messaging";

export const clientMessages = {
  ping: messages.PingMessage,
  watchRoomData: messages.WatchRoomDataMessage,
};

type TypeOfClientMessages = typeof clientMessages;

export type ClientMessage = {
  [K in keyof TypeOfClientMessages]: InstanceType<TypeOfClientMessages[K]>;
};

export default class Client {
  constructor(
    private readonly router: MessageRouter<ClientMessage>,
    public readonly roomCode: string,
    private _userId?: string,
  ) {}

  public get userId() {
    return this._userId;
  }

  public setUserId(id: string) {
    this._userId = id;
  }

  public async start() {
    await this.router.start();
  }

  public stop() {
    this.router.stop();
  }

  public on<K extends keyof ClientMessage>(
    messageType: K,
    handler: (message: ClientMessage[K]) => void,
  ) {
    this.router.on(messageType, handler);
  }

  public once<K extends keyof ClientMessage>(
    messageType: K,
    handler: (message: ClientMessage[K]) => void,
  ) {
    this.router.once(messageType, handler);
  }

  public off<K extends keyof ClientMessage>(
    messageType: K,
    handler: (message: ClientMessage[K]) => void,
  ) {
    this.router.off(messageType, handler);
  }

  public send<K extends keyof ClientMessage>(message: ClientMessage[K]) {
    this.router.send(message);
  }
}
