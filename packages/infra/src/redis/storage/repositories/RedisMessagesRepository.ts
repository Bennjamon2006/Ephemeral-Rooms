import type { Events, Message } from "shared/models";
import { MessagesRepository } from "shared/repositories";
import RedisConsumer from "../../RedisConsumer.js";

export default class RedisMessagesRepository
  extends RedisConsumer
  implements MessagesRepository
{
  private safeParseMessage(messageJson: string | null): Message | null {
    if (messageJson === null) {
      return null;
    }

    try {
      return JSON.parse(messageJson) as Message;
    } catch (err) {
      console.error("Failed to parse message JSON", err);
      return null;
    }
  }

  public async getMessages(
    roomCode: string,
    limit: number = 50,
  ): Promise<Message[]> {
    const key = `room:${roomCode}:messages`;
    const client = await this.getClient();
    const messagesJson = await client.zRange(key, -limit, -1);

    return messagesJson
      .map((messageJson) => this.safeParseMessage(messageJson))
      .filter((message): message is Message => message !== null);
  }

  private async getNextMessageId(roomCode: string): Promise<number> {
    const key = `room:${roomCode}:messageId`;
    const client = await this.getClient();
    return await client.incr(key);
  }

  public async addTextMessage(
    roomCode: string,
    content: string,
    userId: string,
  ): Promise<Message> {
    const key = `room:${roomCode}:messages`;
    const client = await this.getClient();

    const messageId = await this.getNextMessageId(roomCode);
    const message: Message = {
      id: messageId,
      content,
      userId,
      timestamp: Date.now(),
      type: "text",
    };

    await client.zAdd(key, {
      score: messageId,
      value: JSON.stringify(message),
    });

    return message;
  }

  public async addSystemMessage(
    roomCode: string,
    event: Events,
    userId: string,
  ): Promise<Message> {
    const key = `room:${roomCode}:messages`;
    const client = await this.getClient();

    const messageId = await this.getNextMessageId(roomCode);
    const message: Message = {
      id: messageId,
      event,
      userId,
      timestamp: Date.now(),
      type: "system",
    };

    await client.zAdd(key, {
      score: messageId,
      value: JSON.stringify(message),
    });

    return message;
  }

  public async setExpiration(
    roomCode: string,
    expiresAt: number,
  ): Promise<void> {
    const messagesKey = `room:${roomCode}:messages`;

    const client = await this.getClient();

    const ttlSeconds = Math.ceil((expiresAt - Date.now()) / 1000);
    await client.expire(messagesKey, ttlSeconds);
  }
}
