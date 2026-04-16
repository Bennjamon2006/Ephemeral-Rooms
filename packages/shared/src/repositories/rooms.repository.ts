import type { RoomState } from "../models";

export default interface RoomsRepository {
  getRoomState(roomCode: string): Promise<RoomState | null>;
  setRoomState(roomCode: string, roomState: RoomState): Promise<void>;
  createRoom(roomCode: string, roomState: RoomState): Promise<boolean>;
}
