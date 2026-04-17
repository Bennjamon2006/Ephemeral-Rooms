import type { RoomState } from "shared/models";
import createContainer from "../container";

const getRoomByCode = async (code: string): Promise<RoomState | null> => {
  const { roomsUseCases } = await createContainer();

  return roomsUseCases.getRoomData(code);
};

const roomsService = {
  getRoomByCode,
};

export default roomsService;
