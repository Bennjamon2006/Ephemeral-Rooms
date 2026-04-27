import { RoomContext } from "application/classes";
import { RoomContextFactory } from "application/interfaces";
import { MessageRouter } from "application/messaging";
import RedisMessageTransporter from "./messaging/RedisMessageTransporter.js";
import RedisConsumer from "./RedisConsumer.js";

export default class RedisRoomContextFactory
  extends RedisConsumer
  implements RoomContextFactory
{
  private readonly cache: Map<string, RoomContext> = new Map();

  public async create(roomCode: string): Promise<RoomContext> {
    if (this.cache.has(roomCode)) {
      return this.cache.get(roomCode)!;
    }

    const channel = `room:${roomCode}`;

    const transporter = await RedisMessageTransporter.create(channel);

    const router = new MessageRouter(transporter, "system");

    await router.start();

    const roomContext = new RoomContext(router);

    this.cache.set(roomCode, roomContext);

    return roomContext;
  }
}
