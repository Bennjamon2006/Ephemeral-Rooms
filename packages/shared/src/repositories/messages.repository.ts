import type { Message, Events } from "@/models";

export default interface MessagesRepository {
  getMessages(roomCode: string, limit?: number): Promise<Message[]>;
  addTextMessage(
    roomCode: string,
    content: string,
    userId: string,
  ): Promise<Message>;
  addSystemMessage(
    roomCode: string,
    event: Events,
    userId?: string,
  ): Promise<Message>;
  setExpiration(roomCode: string, expiresAt: number): Promise<void>;
}
