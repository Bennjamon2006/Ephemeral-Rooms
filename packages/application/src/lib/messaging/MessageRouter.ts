import { Message, MessageHandler, MessageTransporter } from "shared/messaging";

type MessagesMap = {
  [type: string]: Message<string, any>;
};

type MessageConstructor<T extends Message<string, any>> = new (
  payload: T["payload"],
  timestamp?: number,
  senderId?: string,
) => T;

type MessagesMapWithConstructors<M extends MessagesMap> = {
  [K in keyof M]: MessageConstructor<M[K]>;
};

export default class MessageRouter<M extends MessagesMap> {
  private readonly handlers: Map<keyof M, Set<MessageHandler<any>>> = new Map();

  constructor(
    private readonly transporter: MessageTransporter,
    private readonly messages: MessagesMapWithConstructors<M>,
  ) {}

  public on<T extends keyof M>(type: T, handler: MessageHandler<M[T]>) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }

    this.handlers.get(type)!.add(handler);
  }

  public once<T extends keyof M>(type: T, handler: MessageHandler<M[T]>) {
    const wrapper = (message: M[T]) => {
      handler(message);
      this.off(type, wrapper);
    };

    this.on(type, wrapper);
  }

  public off<T extends keyof M>(type: T, handler: MessageHandler<M[T]>) {
    if (this.handlers.has(type)) {
      this.handlers.get(type)!.delete(handler);
    }
  }

  public send<T extends keyof M>(message: M[T]) {
    this.transporter.sendMessage(message.serialize());
  }

  private deserialize<K extends keyof M>(raw: string): M[K] | null {
    try {
      const parsed = JSON.parse(raw);
      const { type } = parsed;

      if (typeof type !== "string") {
        throw new Error("Message type must be a string");
      }

      const MessageClass = this.messages[type as K];

      if (!MessageClass) {
        throw new Error(`Unknown message type: ${type}`);
      }

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
      const handlers = this.handlers.get(message.type);

      if (handlers) {
        handlers.forEach((handler) => handler(message));
      }
    }
  }

  public async start() {
    await this.transporter.prepare();
    this.transporter.onMessage(this.handle.bind(this));
  }
}
