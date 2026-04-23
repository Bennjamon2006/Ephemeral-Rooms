import { RoomState } from "shared/models";
import { RoomsRepository } from "shared/repositories";
import generateCode from "@/helpers/generateCode.js";
import calculateExpiresAt from "@/helpers/calculateExpiresAt.js";
import { RoomContextFactory } from "@/lib/interfaces/index.js";
import MessageRouter from "@/lib/messaging/MessageRouter.js";
import { messages } from "shared/messaging";

export default class RoomsUseCases {
  private readonly ROOM_CODE_LENGTH = 6;

  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly roomContextFactory: RoomContextFactory,
    private readonly systemMessageRouter: MessageRouter<"system">,
  ) {}

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

    this.systemMessageRouter.send(
      new messages.system.roomDataUpdate({ roomCode, roomState }),
    );

    const roomContext = await this.roomContextFactory.create(roomCode);

    roomContext.sendRoomDataUpdate(roomState);
  }

  public async watchRoomData(
    roomCode: string,
    callback: (roomState: RoomState) => void,
  ): Promise<() => void> {
    const roomContext = await this.roomContextFactory.create(roomCode);

    return roomContext.onRoomStateChange(callback);
  }
}
