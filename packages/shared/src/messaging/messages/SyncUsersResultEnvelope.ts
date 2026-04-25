import Envelope from "../Envelope.js";
import type { User } from "@/models/User.js";

type Payload = {
  users: User[];
};

export default class SyncUsersResultEnvelope extends Envelope<
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
