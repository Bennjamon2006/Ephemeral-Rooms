import Message from "../Message.js";
import RoomDataUpdatedMessage from "./RoomDataUpdateMessage.js";
import WatchRoomDataMessage from "./WatchRoomDataMessage.js";
import AuthMessage from "./AuthMessage.js";
import UserJoinedMessage from "./UserJoinedMessage.js";
import UserCreatedMessage from "./UserCreatedMessage.js";
import WatchUserCreatedMessage from "./WatchUserCreatedMessage.js";
import UserLeftMessage from "./UserLeftMessage.js";
import UpdateRoomMessage from "./UpdateRoomMessage.js";

export const commands = {
  watchRoomData: WatchRoomDataMessage,
  watchUserCreated: WatchUserCreatedMessage,
  auth: AuthMessage,
  updateRoom: UpdateRoomMessage,
} as const;

export const events = {
  roomDataUpdated: RoomDataUpdatedMessage,
  userJoined: UserJoinedMessage,
  userCreated: UserCreatedMessage,
  userLeft: UserLeftMessage,
} as const;
