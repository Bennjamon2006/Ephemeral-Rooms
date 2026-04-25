import Envelope from "../Envelope.js";
import type { User } from "@/models";

type Payload = {
  user: User;
};

export default class UserCreatedEnvelope extends Envelope<
  "userCreated",
  Payload
> {
  constructor(payload: Payload) {
    super("userCreated", payload);
  }

  validate(): boolean {
    const { user } = this.payload;

    return (
      typeof user === "object" &&
      typeof user.id === "string" &&
      typeof user.name === "string"
    );
  }
}
