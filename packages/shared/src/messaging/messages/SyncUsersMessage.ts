import Message from "../Message.js";

export default class SyncUsersMessage extends Message<"syncUsers", {}> {
  constructor(payload: {} = {}) {
    super("syncUsers", payload);
  }

  public validate(): boolean {
    return true;
  }
}
