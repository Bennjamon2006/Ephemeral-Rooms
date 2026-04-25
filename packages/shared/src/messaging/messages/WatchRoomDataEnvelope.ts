import Envelope from "../Envelope.js";

export default class WatchRoomDataEnvelope extends Envelope<
  "watchRoomData",
  {}
> {
  constructor(payload: {} = {}) {
    super("watchRoomData", payload);
  }

  validate(): boolean {
    return true;
  }
}
