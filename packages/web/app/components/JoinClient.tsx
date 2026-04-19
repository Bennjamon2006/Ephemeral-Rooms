"use client";

import { Card } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type { User, RoomState } from "shared/models";
import CustomButton from "./Button";
import useName from "../hooks/useName";
import RoomPreview from "./RoomPreview";

type Props = {
  roomCode: string;
  room: RoomState;
  users: User[];
};

export default function JoinClient({ roomCode, room, users }: Props) {
  const router = useRouter();

  const { name, updateName } = useName();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const disabled = loading || !name.trim() || result === "success";

  const handleJoin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/room/${roomCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name }),
      });

      if (response.ok) {
        setResult("success");
        router.push(`/room/${roomCode}`);
      } else {
        setResult("error");
      }
    } catch (error) {
      setResult("error");

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sala: {roomCode}
        </h1>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={(e) => updateName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim() && !disabled) {
                handleJoin();
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div className="mt-4">
          <CustomButton disabled={disabled} onClick={handleJoin}>
            {loading
              ? "Uniéndote..."
              : result === "error"
                ? "Error al unirse, intenta de nuevo"
                : "Unirse a la sala"}
          </CustomButton>

          {result === "success" && (
            <p className="mt-2 text-green-600 dark:text-green-400">
              Redireccionando a la sala...
            </p>
          )}

          {result === "error" && (
            <p className="mt-2 text-red-600 dark:text-red-400">
              Ocurrió un error al intentar unirse a la sala. Por favor, intenta
              de nuevo.
            </p>
          )}
        </div>

        <div className="mt-2">
          <RoomPreview roomCode={roomCode} room={room} users={users} />
        </div>
      </Card>
    </div>
  );
}
