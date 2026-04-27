import type { Message } from "shared/models";
import createContainer from "../container";

const getMessagesInRoom = async (roomCode: string): Promise<Message[]> => {
  const { messagesUseCases } = await createContainer();

  return messagesUseCases.getMessagesInRoom(roomCode);
};

const messagesService = {
  getMessagesInRoom,
};

export default messagesService;
