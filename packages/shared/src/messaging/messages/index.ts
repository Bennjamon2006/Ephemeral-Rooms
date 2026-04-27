import Envelope from "../Envelope.js";
import RoomDataUpdatedEnvelope from "./RoomDataUpdateEnvelope.js";
import WatchRoomDataEnvelope from "./WatchRoomDataEnvelope.js";
import AuthEnvelope from "./AuthEnvelope.js";
import UserJoinedEnvelope from "./UserJoinedEnvelope.js";
import UserCreatedEnvelope from "./UserCreatedEnvelope.js";
import WatchUserCreatedEnvelope from "./WatchUserCreatedEnvelope.js";
import UserLeftEnvelope from "./UserLeftEnvelope.js";
import UpdateRoomEnvelope from "./UpdateRoomEnvelope.js";
import SyncUsersEnvelope from "./SyncUsersEnvelope.js";
import SyncOnlineUsersEnvelope from "./SyncOnlineUsersEnvelope.js";
import SyncOnlineUsersResultEnvelope from "./SyncOnlineUsersResultEnvelope.js";
import SyncUsersResultEnvelope from "./SyncUsersResultEnvelope.js";
import SendMessageEnvelope from "./SendMessageEnvelope.js";

export const commands = {
  watchRoomData: WatchRoomDataEnvelope,
  watchUserCreated: WatchUserCreatedEnvelope,
  auth: AuthEnvelope,
  updateRoom: UpdateRoomEnvelope,
  syncOnlineUsers: SyncOnlineUsersEnvelope,
  syncUsers: SyncUsersEnvelope,
  sendMessage: SendMessageEnvelope,
} as const;

export const events = {
  roomDataUpdated: RoomDataUpdatedEnvelope,
  userJoined: UserJoinedEnvelope,
  userCreated: UserCreatedEnvelope,
  userLeft: UserLeftEnvelope,
  syncOnlineUsersResult: SyncOnlineUsersResultEnvelope,
  syncUsersResult: SyncUsersResultEnvelope,
} as const;
