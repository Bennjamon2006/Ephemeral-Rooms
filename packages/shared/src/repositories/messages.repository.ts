import type { Message } from "@/models";

export default interface MessagesRepository {
  getMessages(roomCode: string, limit?: number): Promise<Message[]>;
  addMessage(
    roomCode: string,
    content: string,
    userId: string,
  ): Promise<Message>;
}
