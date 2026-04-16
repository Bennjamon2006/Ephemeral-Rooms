import { roomsRepository } from "infra/storage";
import { RoomState } from "shared/models";
import generateCode from "../helpers/generateCode";
import calculateExpiresAt from "../helpers/calculateExpiresAt";

const ROOM_CODE_LENGTH = 6;

export const getRoomData = async (
  roomCode: string,
): Promise<RoomState | null> => {
  return roomsRepository.getRoomState(roomCode);
};

type CreateRoomResult = RoomState & { code: string };

export const createRoom = async (): Promise<CreateRoomResult> => {
  while (true) {
    const code = generateCode(ROOM_CODE_LENGTH);

    const roomState: RoomState = {
      empty: true,
      expiresAt: calculateExpiresAt("empty"),
    };

    const created = await roomsRepository.createRoom(code, roomState);

    if (created) {
      return {
        code,
        ...roomState,
      };
    }
  }
};

export const updateRoom = async (
  roomCode: string,
  empty: boolean,
): Promise<void> => {
  const roomState: RoomState = {
    empty,
    expiresAt: calculateExpiresAt(empty ? "empty" : "occupied"),
  };

  await roomsRepository.setRoomState(roomCode, roomState);
};
