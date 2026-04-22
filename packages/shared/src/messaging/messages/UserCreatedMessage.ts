import Message from "../Message.js";
import type { User } from "@/models";

type Payload = {
  user: User;
};

export default class UserCreatedMessage extends Message<
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
