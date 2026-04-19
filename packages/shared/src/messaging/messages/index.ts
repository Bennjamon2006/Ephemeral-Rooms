import Message from "../Message.js";
import RoomDataUpdateMessage from "./RoomDataUpdateMessage.js";
import WatchRoomDataMessage from "./WatchRoomDataMessage.js";
import RoomUpdateMessage from "./RoomUpdate.js";

export const messages = {
  system: {
    roomDataUpdate: RoomDataUpdateMessage,
  },
  client: {
    watchRoomData: WatchRoomDataMessage,
    roomUpdate: RoomUpdateMessage,
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
