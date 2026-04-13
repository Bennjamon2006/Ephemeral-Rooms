"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CustomButton from "./Button";

export default function CreateRoomButton() {
  const [status, setStatus] = useState<
    "idle" | "creating" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const disableButton = status === "creating" || status === "success";
  const router = useRouter();

  const handleCreateRoom = async () => {
    setStatus("creating");
    setErrorMessage("");

    try {
      const response = await fetch("/api/room", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      router.push(`/room/${data.room.code}/join`);

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage("Error al crear la sala. Inténtalo de nuevo.");
      console.error("Error creating room:", error);
    }
  };

  return (
    <>
      <CustomButton onClick={handleCreateRoom} disabled={disableButton}>
        {status === "creating"
          ? "Creando sala..."
          : status === "success"
            ? "Sala creada"
            : "Crear Sala"}

        {status === "error" && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </CustomButton>
    </>
  );
}
