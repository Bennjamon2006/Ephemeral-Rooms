import Envelope from "../Envelope.js";

type Payload = {
  userId: string;
};

export default class UserJoinedEnvelope extends Envelope<
  "userJoined",
  Payload
> {
  constructor(payload: Payload) {
    super("userJoined", payload);
  }

  validate(): boolean {
    const { userId } = this.payload;
    return typeof userId === "string";
  }
}
