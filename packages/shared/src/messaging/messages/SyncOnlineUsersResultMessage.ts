import Message from "../Message.js";

type Payload = {
  onlineUsers: string[];
};

export default class SyncOnlineUsersResultMessage extends Message<
  "syncOnlineUsersResult",
  Payload
> {
  constructor(payload: Payload) {
    super("syncOnlineUsersResult", payload);
  }

  public validate(): boolean {
    return (
      Array.isArray(this.payload.onlineUsers) &&
      this.payload.onlineUsers.every((id) => typeof id === "string")
    );
  }
}
