import Message from "../Message.js";

export default class SyncOnlineUsersMessage extends Message<
  "syncOnlineUsers",
  {}
> {
  constructor(payload: {} = {}) {
    super("syncOnlineUsers", payload);
  }

  public validate(): boolean {
    return true;
  }
}
