import Message from "../Message.js";

type Payload = {
  userId: string;
};

export default class AuthMessage extends Message<"auth", Payload> {
  constructor(payload: Payload) {
    super("auth", payload);
  }

  public validate(): boolean {
    return (
      typeof this.payload.userId === "string" && this.payload.userId.length > 0
    );
  }
}
