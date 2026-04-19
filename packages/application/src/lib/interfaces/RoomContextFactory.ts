import RoomContext from "../classes/RoomContext.js";

export default interface RoomContextFactory {
  create(roomCode: string): Promise<RoomContext>;
}
