import type { Events, Message } from "shared/models";
import type { MessagesRepository } from "shared/repositories";

export default class MessagesUseCases {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  public async getMessagesInRoom(
    roomCode: string,
    limit: number = 50,
  ): Promise<Message[]> {
    return await this.messagesRepository.getMessages(roomCode, limit);
  }

  public async addTextMessage(
    roomCode: string,
    content: string,
    userId: string,
  ): Promise<Message> {
    return await this.messagesRepository.addTextMessage(
      roomCode,
      content,
      userId,
    );
  }

  public async addSystemMessage(
    roomCode: string,
    event: Events,
    userId: string,
  ): Promise<Message> {
    return await this.messagesRepository.addSystemMessage(
      roomCode,
      event,
      userId,
    );
  }
}
