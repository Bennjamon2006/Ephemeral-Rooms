import Envelope from "../Envelope.js";

export default class SyncMessagesEnvelope extends Envelope<"syncMessages", {}> {
  constructor() {
    super("syncMessages", {});
  }

  public validate(): boolean {
    return true;
  }
}
