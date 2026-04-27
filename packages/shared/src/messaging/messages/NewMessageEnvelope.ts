import Envelope from "../Envelope.js";
import type { Message } from "@/models/Message.js";

type Payload = {
  message: Message;
};

export default class NewMessageEnvelope extends Envelope<
  "newMessage",
  Payload
> {
  constructor(payload: Payload) {
    super("newMessage", payload);
  }

  public validate(): boolean {
    return (
      typeof this.payload.message === "object" &&
      typeof this.payload.message.id === "number" &&
      typeof this.payload.message.content === "string" &&
      typeof this.payload.message.userId === "string" &&
      typeof this.payload.message.timestamp === "number"
    );
  }
}
