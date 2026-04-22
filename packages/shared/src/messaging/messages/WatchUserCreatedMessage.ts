import Message from "../Message.js";

export default class WatchUserCreatedMessage extends Message<
  "watchUserCreated",
  {}
> {
  constructor() {
    super("watchUserCreated", {});
  }

  public validate() {
    return true;
  }
}
