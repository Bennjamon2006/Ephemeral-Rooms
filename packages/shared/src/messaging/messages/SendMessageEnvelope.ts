import Envelope from "../Envelope.js";

type Payload = {
  content: string;
};

export default class SendMessageEnvelope extends Envelope<
  "sendMessage",
  Payload
> {
  constructor(payload: Payload) {
    super("sendMessage", payload);
  }

  public validate(): boolean {
    return (
      typeof this.payload.content === "string" &&
      this.payload.content.trim() !== ""
    );
  }
}
