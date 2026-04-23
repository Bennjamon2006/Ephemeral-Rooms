import { MessageRouter } from "application/messaging";
import {
  MessageHandler,
  messages,
  MessagesMap,
  ResolveMessageType,
} from "shared/messaging";

type ClientMessage = MessagesMap["client"];

type ResolveClientMessageType<T extends keyof ClientMessage> =
  ResolveMessageType<"client", T>;

type ClientMessageHandler<T extends keyof ClientMessage> = MessageHandler<
  ResolveClientMessageType<T>
>;

export default class Client {
  private readonly closeListeners: (() => void)[] = [];

  constructor(
    private readonly router: MessageRouter<"client">,
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
    this.closeListeners.forEach((listener) => listener());
  }

  public on<K extends keyof ClientMessage>(
    messageType: K,
    handler: ClientMessageHandler<K>,
  ) {
    this.router.on(messageType, (message) => {
      handler(message);
    });
  }

  public once<K extends keyof ClientMessage>(
    messageType: K,
    handler: ClientMessageHandler<K>,
  ) {
    this.router.once(messageType, handler);
  }

  public off<K extends keyof ClientMessage>(
    messageType: K,
    handler: ClientMessageHandler<K>,
  ) {
    this.router.off(messageType, handler);
  }

  public send(message: ResolveClientMessageType<keyof ClientMessage>) {
    this.router.send(message);
  }

  public onClose(listener: () => void) {
    this.closeListeners.push(listener);
  }
}
