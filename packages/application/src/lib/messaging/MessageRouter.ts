import {
  messages,
  MessagesMap,
  MessageHandler,
  MessageTransporter,
  ResolveMessageType,
} from "shared/messaging";

type HandlerMap<K extends keyof MessagesMap> = {
  [T in keyof MessagesMap[K]]?: Set<MessageHandler<ResolveMessageType<K, T>>>;
};

export default class MessageRouter<K extends keyof MessagesMap> {
  private readonly handlers: HandlerMap<K> = {};
  private readonly messages: MessagesMap[K];

  constructor(
    private readonly transporter: MessageTransporter,
    private readonly scope: K,
  ) {
    this.messages = messages[scope];
  }

  public on<T extends keyof MessagesMap[K]>(
    type: T,
    handler: MessageHandler<ResolveMessageType<K, T>>,
  ) {
    if (!this.handlers[type]) {
      this.handlers[type] = new Set();
    }

    this.handlers[type]!.add(handler);
  }

  public once<T extends keyof MessagesMap[K]>(
    type: T,
    handler: MessageHandler<ResolveMessageType<K, T>>,
  ) {
    const wrapper = (message: ResolveMessageType<K, T>) => {
      handler(message);
      this.off(type, wrapper);
    };

    this.on(type, wrapper);
  }

  public off<T extends keyof MessagesMap[K]>(
    type: T,
    handler: MessageHandler<ResolveMessageType<K, T>>,
  ) {
    if (this.handlers[type]) {
      this.handlers[type]!.delete(handler);
    }
  }

  public send<T extends keyof MessagesMap[K]>(
    message: ResolveMessageType<K, T>,
  ) {
    this.transporter.sendMessage(message.serialize());
  }

  private resolveMessageClass<T extends keyof MessagesMap[K] & string>(
    type: T,
  ): MessagesMap[K][T] {
    const MessageClass = this.messages[type];

    if (!MessageClass) {
      throw new Error(`Unknown message type: ${type}`);
    }

    return MessageClass;
  }

  private deserialize(
    raw: string,
  ): ResolveMessageType<K, keyof MessagesMap[K]> | null {
    try {
      const parsed = JSON.parse(raw);
      const { type } = parsed as { type: keyof MessagesMap[K] };

      if (typeof type !== "string") {
        throw new Error("Message type must be a string");
      }

      const MessageClass = this.resolveMessageClass(type) as new (
        payload: any,
        timestamp: number,
        senderId: string,
      ) => ResolveMessageType<K, typeof type>;

      return new MessageClass(
        parsed.payload,
        parsed.timestamp,
        parsed.senderId,
      );
    } catch (error) {
      console.error("Failed to deserialize message:", error);
      return null;
    }
  }

  private handle(raw: string) {
    const message = this.deserialize(raw);

    if (message) {
      const type = message.type as keyof MessagesMap[K];
      const handlers = this.handlers[type];

      if (handlers) {
        handlers.forEach((handler) => handler(message));
      }
    }
  }

  public async start() {
    await this.transporter.prepare();

    this.transporter.onMessage(this.handle.bind(this));
  }

  public stop() {
    this.transporter.close();

    for (const type in this.handlers) {
      this.handlers[type as keyof MessagesMap[K]]!.clear();
    }
  }
}
