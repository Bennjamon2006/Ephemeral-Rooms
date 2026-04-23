import Message from "../Message.js";
import { RoomState } from "../../models/RoomState.js";

type Payload = {
  roomState: RoomState;
  roomCode?: string; // Optional: Only included in system messages, not in client messages
};

export default class RoomDataUpdatedMessage extends Message<
  "roomDataUpdated",
  Payload
> {
  constructor(payload: Payload) {
    super("roomDataUpdated", payload);
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
