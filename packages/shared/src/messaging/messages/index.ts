import Message from "../Message.js";
import RoomDataUpdateMessage from "./RoomDataUpdateMessage.js";
import WatchRoomDataMessage from "./WatchRoomDataMessage.js";
import RoomUpdateMessage from "./RoomUpdate.js";
import AuthMessage from "./AuthMessage.js";
import UserJoinedMessage from "./UserJoinedMessage.js";
import UserCreatedMessage from "./UserCreatedMessage.js";
import WatchUserCreatedMessage from "./WatchUserCreatedMessage.js";

export const messages = {
  system: {
    roomDataUpdate: RoomDataUpdateMessage,
    userCreated: UserCreatedMessage,
  },
  client: {
    watchRoomData: WatchRoomDataMessage,
    roomUpdate: RoomUpdateMessage,
    auth: AuthMessage,
    userJoined: UserJoinedMessage,
    watchUserCreated: WatchUserCreatedMessage,
    userCreated: UserCreatedMessage,
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
