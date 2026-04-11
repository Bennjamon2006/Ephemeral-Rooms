"use client";

import { Card } from "flowbite-react";
import type { User } from "shared";
import CustomButton from "./Button";

type Props = {
  roomCode: string;
  users: User[];
};

export default function JoinClient({ roomCode, users }: Props) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sala: {roomCode}
        </h1>

        <div className="mt-4">
          <CustomButton variant="link" href={`/room/${roomCode}`}>
            Unirse a la sala
          </CustomButton>
        </div>

        <div className="mt-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            {users.length > 1
              ? `${users[0].name} y ${users.length - 1} más están en esta sala`
              : users.length === 1
                ? `${users[0].name} está en esta sala`
                : "No hay usuarios en la sala"}
          </h2>
        </div>
      </Card>
    </div>
  );
}
