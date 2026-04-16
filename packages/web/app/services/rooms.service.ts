import { rooms } from "application";
import type { RoomState } from "shared/models";

const getRoomByCode = async (code: string): Promise<RoomState | null> => {
  return rooms.getRoomData(code);
};

const roomsService = {
  getRoomByCode,
};

export default roomsService;
