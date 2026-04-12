"use client";

import { Card } from "flowbite-react";
import type { User } from "shared";
import CustomButton from "./Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  roomCode: string;
  users: User[];
  roomTimeout?: number;
};

export default function JoinClient({ roomCode, roomTimeout, users }: Props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  const disabled = loading || !username.trim() || result === "success";

  const handleJoin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/room/${roomCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && username.trim() && !disabled) {
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            {users.length > 1
              ? `${users[0].name} y ${users.length - 1} más están en esta sala`
              : users.length === 1
                ? `${users[0].name} está en esta sala`
                : `No hay usuarios conectados, la sala se eliminará en ${roomTimeout ?? 0} segundos`}
          </h2>
        </div>
      </Card>
    </div>
  );
}
