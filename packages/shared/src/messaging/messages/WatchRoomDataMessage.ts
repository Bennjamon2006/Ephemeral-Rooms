import Message from "../Message.js";

type Payload = {
  roomCode: string;
};

export default class WatchRoomDataMessage extends Message<
  "watchRoomData",
  Payload
> {
  constructor(payload: Payload) {
    super("watchRoomData", payload);
  }

  validate(): boolean {
    const { roomCode } = this.payload;
    return typeof roomCode === "string";
  }
}
