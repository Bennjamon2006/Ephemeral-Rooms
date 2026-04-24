import Message from "../Message.js";
import RoomDataUpdatedMessage from "./RoomDataUpdateMessage.js";
import WatchRoomDataMessage from "./WatchRoomDataMessage.js";
import AuthMessage from "./AuthMessage.js";
import UserJoinedMessage from "./UserJoinedMessage.js";
import UserCreatedMessage from "./UserCreatedMessage.js";
import WatchUserCreatedMessage from "./WatchUserCreatedMessage.js";
import UserLeftMessage from "./UserLeftMessage.js";
import UpdateRoomMessage from "./UpdateRoomMessage.js";
import SyncUsersMessage from "./SyncUsersMessage.js";
import SyncOnlineUsersMessage from "./SyncOnlineUsersMessage.js";
import SyncOnlineUsersResultMessage from "./SyncOnlineUsersResultMessage.js";
import SyncUsersResultMessage from "./SyncUsersResultMessage.js";

export const commands = {
  watchRoomData: WatchRoomDataMessage,
  watchUserCreated: WatchUserCreatedMessage,
  auth: AuthMessage,
  updateRoom: UpdateRoomMessage,
  syncOnlineUsers: SyncOnlineUsersMessage,
  syncUsers: SyncUsersMessage,
} as const;

export const events = {
  roomDataUpdated: RoomDataUpdatedMessage,
  userJoined: UserJoinedMessage,
  userCreated: UserCreatedMessage,
  userLeft: UserLeftMessage,
  syncOnlineUsersResult: SyncOnlineUsersResultMessage,
  syncUsersResult: SyncUsersResultMessage,
} as const;
