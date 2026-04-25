import Envelope from "../Envelope.js";

export default class SyncUsersEnvelope extends Envelope<"syncUsers", {}> {
  constructor(payload: {} = {}) {
    super("syncUsers", payload);
  }

  public validate(): boolean {
    return true;
  }
}
