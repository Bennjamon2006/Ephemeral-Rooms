import { RoomContext } from "application/classes";
import { RoomContextFactory } from "application/interfaces";
import { MessageRouter } from "application/messaging";
import RedisMessageTransporter from "./messaging/RedisMessageTransporter.js";
import RedisConsumer from "./RedisConsumer.js";

export default class RedisRoomContextFactory
  extends RedisConsumer
  implements RoomContextFactory
{
  public async create(roomCode: string): Promise<RoomContext> {
    const channel = `room:${roomCode}`;

    const transporter = await RedisMessageTransporter.create(channel);

    const router = new MessageRouter(transporter, "system");

    await router.start();

    return new RoomContext(router);
  }
}
