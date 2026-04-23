import Message from "../Message.js";

type Payload = {
  roomCode: string;
  empty: boolean;
};

export default class UpdateRoomMessage extends Message<"updateRoom", Payload> {
  constructor(payload: Payload) {
    super("updateRoom", payload);
  }

  public validate(): boolean {
    const { empty } = this.payload;

    if (typeof empty !== "boolean") {
      return false;
    }

    return true;
  }
}
