import { rooms } from "data";
import type { RoomState } from "shared";

const getRoomByCode = async (code: string): Promise<RoomState | null> => {
  return rooms.getRoomData(code);
};

const roomsService = {
  getRoomByCode,
};

export default roomsService;
