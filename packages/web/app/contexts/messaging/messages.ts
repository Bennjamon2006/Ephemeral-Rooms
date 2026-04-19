import { messages } from "shared/messaging";

const messageMap = {
  WatchRoomData: messages.WatchRoomDataMessage,
};

export default messageMap;

type MessageMap = typeof messageMap;

export type MessageTypes = {
  [K in keyof MessageMap]: InstanceType<MessageMap[K]>;
};
