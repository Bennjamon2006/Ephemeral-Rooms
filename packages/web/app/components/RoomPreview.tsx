import { RoomState, User } from "shared/models";
import useTimeRemaining from "../hooks/useTimeRemaing";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useDispatch from "../hooks/useDispatch";
import { messages } from "shared/messaging";
import useMessage from "../hooks/useMessage";
import useRoomState from "../hooks/useRoomState";

type Props = {
  roomCode: string;
  room: RoomState;
  users: User[];
};

export default function RoomPreview({ roomCode, room, users }: Props) {
  const router = useRouter();

  const roomState = useRoomState(roomCode, room);

  const timeRemaining = useTimeRemaining(
    roomState.expiresAt,
    users.length === 0,
  );
  const timeInSeconds = Math.ceil(timeRemaining / 1000);

  useEffect(() => {
    if (timeRemaining === 0) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [timeRemaining, router]);

  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
      {!roomState.empty && users.length === 0
        ? "Alguien está en la sala"
        : timeRemaining === 0
          ? "La sala ha expirado. Volviendo al inicio..."
          : users.length > 1
            ? `${users[0].name} y ${users.length - 1} más están en esta sala`
            : users.length === 1
              ? `${users[0].name} está en esta sala`
              : `No hay usuarios conectados, la sala se eliminará en ${timeInSeconds} segundos`}
    </h2>
  );
}
