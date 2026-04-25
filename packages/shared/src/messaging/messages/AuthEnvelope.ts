import Envelope from "../Envelope.js";

type Payload = {
  userId: string;
};

export default class AuthEnvelope extends Envelope<"auth", Payload> {
  constructor(payload: Payload) {
    super("auth", payload);
  }

  public validate(): boolean {
    return (
      typeof this.payload.userId === "string" && this.payload.userId.length > 0
    );
  }
}
