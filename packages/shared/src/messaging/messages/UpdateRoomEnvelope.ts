import Envelope from "../Envelope.js";

type Payload = {
  roomCode: string;
  empty: boolean;
};

export default class UpdateRoomEnvelope extends Envelope<
  "updateRoom",
  Payload
> {
  constructor(payload: Payload) {
    super("updateRoom", payload);
  }

  public validate(): boolean {
    const { empty } = this.payload;

    if (typeof empty !== "boolean") {
      return false;
    }

    return true;
  }
}
