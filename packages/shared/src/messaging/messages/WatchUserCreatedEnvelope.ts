import Envelope from "../Envelope.js";

export default class WatchUserCreatedEnvelope extends Envelope<
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
