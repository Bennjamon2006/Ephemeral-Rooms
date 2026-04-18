import type { UsersRepository } from "shared/repositories";
import type { User } from "shared/models";
import RedisConsumer from "../../RedisConsumer.js";

export default class RedisUsersRepository
  extends RedisConsumer
  implements UsersRepository
{
  private safeParseUser(userJson: string | null): User | null {
    if (userJson === null) {
      return null;
    }

    try {
      return JSON.parse(userJson) as User;
    } catch (err) {
      console.error("Failed to parse user JSON", err);
      return null;
    }
  }

  public async getRoomUsers(roomCode: string): Promise<User[]> {
    const key = `room:${roomCode}:users`;
    const client = await this.getClient();
    const usersJson = await client.hGetAll(key);

    return Object.values(usersJson)
      .map((userJson) => this.safeParseUser(userJson))
      .filter((user): user is User => user !== null);
  }

  public async addUserToRoom(roomCode: string, user: User): Promise<void> {
    const key = `room:${roomCode}:users`;
    const client = await this.getClient();
    await client.hSet(key, user.id, JSON.stringify(user));
  }

  public async removeUserFromRoom(
    roomCode: string,
    userId: string,
  ): Promise<void> {
    const key = `room:${roomCode}:users`;
    const client = await this.getClient();
    await client.hDel(key, userId);
  }

  public async getUser(roomCode: string, userId: string): Promise<User | null> {
    const key = `room:${roomCode}:users`;
    const client = await this.getClient();
    const userJson = await client.hGet(key, userId);

    return this.safeParseUser(userJson);
  }
}
