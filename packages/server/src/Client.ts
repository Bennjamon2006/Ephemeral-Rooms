import { MessageRouter, ClientMessages } from "application/messaging";
import { Message, MessageHandler } from "shared/messaging";

type ResolveClientMessageType<T extends keyof ClientMessages> =
  ClientMessages[T] extends new (...args: any[]) => infer R
    ? R extends Message<any, any>
      ? R
      : never
    : never;

type ClientMessageHandler<T extends keyof ClientMessages> = MessageHandler<
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

  public on<K extends keyof ClientMessages>(
    messageType: K,
    handler: ClientMessageHandler<K>,
  ) {
    this.router.on(messageType, (message) => {
      handler(message);
    });
  }

  public once<K extends keyof ClientMessages>(
    messageType: K,
    handler: ClientMessageHandler<K>,
  ) {
    this.router.once(messageType, handler);
  }

  public off<K extends keyof ClientMessages>(
    messageType: K,
    handler: ClientMessageHandler<K>,
  ) {
    this.router.off(messageType, handler);
  }

  public send(message: ResolveClientMessageType<keyof ClientMessages>) {
    this.router.send(message);
  }

  public onClose(listener: () => void) {
    this.closeListeners.push(listener);
  }
}
