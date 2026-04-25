import Envelope from "../Envelope.js";

type Payload = {
  userId: string;
};

export default class UserLeftEnvelope extends Envelope<"userLeft", Payload> {
  constructor(payload: Payload) {
    super("userLeft", payload);
  }

  validate(): boolean {
    const { userId } = this.payload;
    return typeof userId === "string";
  }
}
