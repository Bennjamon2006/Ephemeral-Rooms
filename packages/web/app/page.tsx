"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "flowbite-react";
import CodeInput from "../app/components/CodeInput";
import CustomButton from "./components/Button";
import CreateRoomButton from "./components/CreateRoomButton";

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const disabled = roomCode.length !== 6;

  const enter = () => {
    if (disabled) return;

    router.push(`/room/${roomCode}/join`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Ephemeral Rooms
          </h1>
          <p className="text-gray-400 text-lg">
            Entra, comparte y desaparece. Sin registros, sin preocupaciones. Tus
            conversaciones, tu espacio temporal.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <span>🔗</span>
            <span>Únete a través de un enlace o código</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <span>👤</span>
            <span>Sin necesidad de cuentas o registros</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm col-span-2 justify-center">
            <span>🗑️</span>
            <span>Los mensajes desaparecen cuando todos salen</span>
          </div>
        </div>
      </div>
      {/* Actions Card */}
      <div className="w-full flex gap-6 mt-8 justify-center">
        <Card className="bg-gray-800/50 border-gray-700 w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Únete a una sala
          </h2>
          <div className="space-y-4">
            <CodeInput value={roomCode} onChange={setRoomCode} enter={enter} />
            <CustomButton onClick={enter} disabled={disabled}>
              Unirse
            </CustomButton>
          </div>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700 w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            O crea una nueva sala
          </h2>
          <CreateRoomButton />
        </Card>
      </div>

      <p className="text-gray-500 text-sm mt-8 text-center max-w-2xl">
        Los mensajes y nombres de usuario son temporales y se eliminan
        automáticamente cuando todos los participantes salen de la sala. No se
        almacenan datos personales ni conversaciones. Disfruta de una
        experiencia de chat efímera bajo tu propio riesgo.
      </p>
    </main>
  );
}
