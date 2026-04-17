import { rooms } from "application/use-cases";
import type { RoomState } from "shared/models";

const getRoomByCode = async (code: string): Promise<RoomState | null> => {
  return rooms.getRoomData(code);
};

const roomsService = {
  getRoomByCode,
};

export default roomsService;
