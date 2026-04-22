import Message from "../Message.js";

export default class WatchRoomDataMessage extends Message<"watchRoomData", {}> {
  constructor(payload: {} = {}) {
    super("watchRoomData", payload);
  }

  validate(): boolean {
    return true;
  }
}
