import { RoomState } from "shared/models";
import type {
  RoomsRepository,
  UsersRepository,
  MessagesRepository,
} from "shared/repositories";

export default class ExpirationService {
  private readonly TTLS = {
    empty: 60 * 1000, // 1 minute
    occupied: 60 * 60 * 1000, // 1 hour
  };

  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly messagesRepository: MessagesRepository,
  ) {}

  private calculateExpiresAt(empty: boolean): number {
    const state = empty ? "empty" : "occupied";

    return Date.now() + this.TTLS[state];
  }

  public async touchRoom(roomId: string, empty: boolean): Promise<RoomState> {
    const expiresAt = this.calculateExpiresAt(empty);

    const roomState: RoomState = {
      empty,
      expiresAt,
    };

    await this.roomsRepository.setRoomState(roomId, roomState);
    await this.usersRepository.setExpiration(roomId, expiresAt);
    await this.messagesRepository.setExpiration(roomId, expiresAt);

    return roomState;
  }
}
