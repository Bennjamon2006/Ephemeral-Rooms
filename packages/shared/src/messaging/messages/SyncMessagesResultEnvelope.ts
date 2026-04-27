import Envelope from "../Envelope.js";
import type { Message } from "@/models/Message.js";

type Payload = {
  messages: Message[];
};

export default class SyncMessagesResultEnvelope extends Envelope<
  "syncMessagesResult",
  Payload
> {
  constructor(payload: Payload) {
    super("syncMessagesResult", payload);
  }

  public validate(): boolean {
    return (
      Array.isArray(this.payload.messages) &&
      this.payload.messages.every((message) => {
        return (
          typeof message.id === "number" &&
          typeof message.content === "string" &&
          typeof message.userId === "string" &&
          typeof message.timestamp === "number"
        );
      })
    );
  }
}
