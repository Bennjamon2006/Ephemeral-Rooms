import type { Room, RoomState } from "shared";
import { redisClient } from "../redisClient";
import generateCode from "../helpers/generateCode";

export const getRoomData = async (
  roomCode: string,
): Promise<RoomState | null> => {
  const roomData = await redisClient.get(`room:${roomCode}:meta`);
  if (!roomData) {
    return null;
  }
  return JSON.parse(roomData) as RoomState;
};

export const createRoom = async (): Promise<Room> => {
  while (true) {
    const code = generateCode(6);

    const result = await redisClient.set(
      `room:${code}:meta`,
      JSON.stringify({
        empty: true,
        expiresAt: Date.now() + 60 * 1000, // 1 minute
      }),
      {
        EX: 60, // expire after 1 minute
        condition: "NX",
      },
    );

    if (result === "OK") {
      return {
        code,
      };
    }
  }
};

export const updateRoomData = async (
  roomCode: string,
  empty: boolean,
): Promise<void> => {
  const ttl = empty ? 60 : 60 * 60; // 1 minute if empty, otherwise 1 hour

  await redisClient.set(
    `room:${roomCode}:meta`,
    JSON.stringify({
      empty,
      expiresAt: Date.now() + ttl * 1000,
    }),
    {
      EX: ttl,
    },
  );
};
