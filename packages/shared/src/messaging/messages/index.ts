import Message from "../Message.js";
import PingMessage from "./PingMessage.js";
import WatchRoomDataMessage from "./WatchRoomDataMessage.js";

export const messages = {
  system: {
    ping: PingMessage,
  },
  client: {
    watchRoomData: WatchRoomDataMessage,
  },
};

export type MessagesMap = typeof messages;

export type ResolveMessageType<
  T extends keyof MessagesMap,
  U extends keyof MessagesMap[T],
> = MessagesMap[T][U] extends (new (
  ...args: any
) => infer R extends Message<string, any>)
  ? R
  : never;
