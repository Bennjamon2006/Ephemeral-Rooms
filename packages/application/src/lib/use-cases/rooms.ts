import { RoomState } from "shared/models";
import { RoomsRepository } from "shared/repositories";
import generateCode from "@/helpers/generateCode";
import calculateExpiresAt from "@/helpers/calculateExpiresAt";

export default class RoomsUseCases {
  private readonly ROOM_CODE_LENGTH = 6;

  constructor(private roomsRepository: RoomsRepository) {}

  public async getRoomData(roomCode: string): Promise<RoomState | null> {
    return this.roomsRepository.getRoomState(roomCode);
  }

  public async createRoom(): Promise<RoomState & { code: string }> {
    while (true) {
      const code = generateCode(this.ROOM_CODE_LENGTH);

      const roomState: RoomState = {
        empty: true,
        expiresAt: calculateExpiresAt("empty"),
      };

      const created = await this.roomsRepository.createRoom(code, roomState);

      if (created) {
        return {
          code,
          ...roomState,
        };
      }
    }
  }

  public async updateRoom(roomCode: string, empty: boolean): Promise<void> {
    const roomState: RoomState = {
      empty,
      expiresAt: calculateExpiresAt(empty ? "empty" : "occupied"),
    };

    await this.roomsRepository.setRoomState(roomCode, roomState);
  }
}
