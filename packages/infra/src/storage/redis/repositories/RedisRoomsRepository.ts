import type { RoomsRepository } from "shared/repositories";
import type { RoomState } from "shared/models";
import RedisConsumer from "../RedisConsumer";

export default class RedisRoomsRepository
  extends RedisConsumer
  implements RoomsRepository
{
  private safeParseRoomState(roomStateJson: string | null): RoomState | null {
    if (roomStateJson === null) {
      return null;
    }

    try {
      return JSON.parse(roomStateJson) as RoomState;
    } catch (err) {
      console.error("Failed to parse room state JSON", err);
      return null;
    }
  }

  private calculateTTL(expiresAt: number): number {
    const ttl = expiresAt - Date.now();
    return Math.max(Math.floor(ttl / 1000), 0);
  }

  public async getRoomState(roomCode: string): Promise<RoomState | null> {
    const key = `room:${roomCode}:state`;
    const client = await this.getClient();
    const roomStateJson = await client.get(key);

    return this.safeParseRoomState(roomStateJson);
  }

  public async setRoomState(
    roomCode: string,
    roomState: RoomState,
  ): Promise<void> {
    const key = `room:${roomCode}:state`;
    const client = await this.getClient();

    await client.set(key, JSON.stringify(roomState), {
      expiration: {
        type: "EX",
        value: this.calculateTTL(roomState.expiresAt),
      },
    });
  }

  public async createRoom(
    roomCode: string,
    roomState: RoomState,
  ): Promise<boolean> {
    const key = `room:${roomCode}:state`;
    const client = await this.getClient();

    const result = await client.set(key, JSON.stringify(roomState), {
      NX: true,
      expiration: {
        type: "EX",
        value: this.calculateTTL(roomState.expiresAt),
      },
    });

    return result === "OK";
  }
}
