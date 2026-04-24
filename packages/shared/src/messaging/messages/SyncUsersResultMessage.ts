import Message from "../Message.js";
import type { User } from "@/models/User.js";

type Payload = {
  users: User[];
};

export default class SyncUsersResultMessage extends Message<
  "syncUsersResult",
  Payload
> {
  constructor(payload: Payload) {
    super("syncUsersResult", payload);
  }

  public validate(): boolean {
    return (
      Array.isArray(this.payload.users) &&
      this.payload.users.every(
        (user) => typeof user.id === "string" && typeof user.name === "string",
      )
    );
  }
}
