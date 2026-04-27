import type { Message } from "shared/models";
import type { MessagesRepository } from "shared/repositories";

export default class MessagesUseCases {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  public async getMessagesInRoom(
    roomCode: string,
    limit: number = 50,
  ): Promise<Message[]> {
    return await this.messagesRepository.getMessages(roomCode, limit);
  }

  public async addMessage(
    roomCode: string,
    content: string,
    userId: string,
  ): Promise<Message> {
    return await this.messagesRepository.addMessage(roomCode, content, userId);
  }
}
