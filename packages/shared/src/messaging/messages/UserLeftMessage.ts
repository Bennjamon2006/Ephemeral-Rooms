import Message from "../Message.js";

type Payload = {
  userId: string;
};

export default class UserLeftMessage extends Message<"userLeft", Payload> {
  constructor(payload: Payload) {
    super("userLeft", payload);
  }

  validate(): boolean {
    const { userId } = this.payload;
    return typeof userId === "string";
  }
}
