import Message from "../Message.js";
import { RoomState } from "../../models/RoomState.js";

type Payload = {
  roomState: RoomState;
};

export default class RoomDataUpdateMessage extends Message<
  "roomDataUpdate",
  Payload
> {
  constructor(payload: Payload) {
    super("roomDataUpdate", payload);
  }

  public validate(): boolean {
    return (
      typeof this.payload.roomState === "object" &&
      typeof this.payload.roomState.empty === "boolean" &&
      typeof this.payload.roomState.expiresAt === "number" &&
      !Number.isNaN(this.payload.roomState.expiresAt) &&
      this.payload.roomState.expiresAt > Date.now()
    );
  }
}
