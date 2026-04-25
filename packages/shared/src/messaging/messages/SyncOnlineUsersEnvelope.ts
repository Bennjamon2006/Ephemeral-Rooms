import Envelope from "../Envelope.js";

export default class SyncOnlineUsersEnvelope extends Envelope<
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
