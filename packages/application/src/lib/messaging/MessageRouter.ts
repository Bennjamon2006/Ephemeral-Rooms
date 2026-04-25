import {
  messages,
  MessageHandler,
  MessageTransporter,
  Envelope,
} from "shared/messaging";

type MapMessageDefinitions<
  C extends keyof typeof messages.commands,
  E extends keyof typeof messages.events,
> = {
  [K in C]: (typeof messages.commands)[K];
} & {
  [K in E]: (typeof messages.events)[K];
};

export type SystemMessages = MapMessageDefinitions<
  "updateRoom" | "watchRoomData" | "watchUserCreated",
  "roomDataUpdated" | "userCreated"
>;

export type ClientMessages = MapMessageDefinitions<
  | "watchUserCreated"
  | "watchRoomData"
  | "auth"
  | "syncOnlineUsers"
  | "syncUsers",
  | "userJoined"
  | "userLeft"
  | "userCreated"
  | "roomDataUpdated"
  | "syncOnlineUsersResult"
  | "syncUsersResult"
>;

const scopes: {
  system: SystemMessages;
  client: ClientMessages;
} = {
  system: {
    updateRoom: messages.commands.updateRoom,
    roomDataUpdated: messages.events.roomDataUpdated,
    watchRoomData: messages.commands.watchRoomData,
    userCreated: messages.events.userCreated,
    watchUserCreated: messages.commands.watchUserCreated,
  },
  client: {
    userJoined: messages.events.userJoined,
    userLeft: messages.events.userLeft,
    userCreated: messages.events.userCreated,
    roomDataUpdated: messages.events.roomDataUpdated,
    watchRoomData: messages.commands.watchRoomData,
    watchUserCreated: messages.commands.watchUserCreated,
    auth: messages.commands.auth,
    syncOnlineUsers: messages.commands.syncOnlineUsers,
    syncUsers: messages.commands.syncUsers,
    syncOnlineUsersResult: messages.events.syncOnlineUsersResult,
    syncUsersResult: messages.events.syncUsersResult,
  },
};

type MessagesMap = {
  system: {
    [K in keyof SystemMessages]: SystemMessages[K];
  };
  client: {
    [K in keyof ClientMessages]: ClientMessages[K];
  };
};

type ResolveMessageType<
  S extends keyof MessagesMap,
  T extends keyof MessagesMap[S],
> = MessagesMap[S][T] extends new (...args: any[]) => infer R
  ? R extends Envelope<any, any>
    ? R
    : never
  : never;

type HandlerMap<K extends keyof MessagesMap> = {
  [T in keyof MessagesMap[K]]?: Set<MessageHandler<ResolveMessageType<K, T>>>;
};

export default class MessageRouter<K extends keyof MessagesMap> {
  private readonly handlers: HandlerMap<K> = {};
  private readonly messages: MessagesMap[K];

  constructor(
    private readonly transporter: MessageTransporter,
    scope: K,
  ) {
    this.messages = scopes[scope];
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

  public send(message: ResolveMessageType<K, keyof MessagesMap[K]>) {
    const msg = message as Envelope<any, any>;

    this.transporter.sendMessage(msg.serialize());
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

  private deserialize<T extends keyof MessagesMap[K] & string>(
    raw: string,
  ): Envelope<any, any> | null {
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
      ) => ResolveMessageType<K, T>;

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

  private handle<T extends keyof MessagesMap[K] & string>(raw: string) {
    const message = this.deserialize<T>(raw);

    if (Envelope.isMessage(message)) {
      const type = message.type as T;
      const handlers = this.handlers[type];

      if (handlers) {
        handlers.forEach((handler) =>
          handler(message as ResolveMessageType<K, T>),
        );
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
