import Message from "../Message.js";

type Payload = {
  userId: string;
};

export default class UserJoinedMessage extends Message<"userJoined", Payload> {
  constructor(payload: Payload) {
    super("userJoined", payload);
  }

  validate(): boolean {
    const { userId } = this.payload;
    return typeof userId === "string";
  }
}
