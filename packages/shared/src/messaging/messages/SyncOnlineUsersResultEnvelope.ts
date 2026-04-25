import Envelope from "../Envelope.js";

type Payload = {
  onlineUsers: string[];
};

export default class SyncOnlineUsersResultEnvelope extends Envelope<
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
