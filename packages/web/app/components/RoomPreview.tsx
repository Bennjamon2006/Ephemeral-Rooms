import { RoomState, User } from "shared/models";
import useTimeRemaining from "../hooks/useTimeRemaing";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useDispatch from "../hooks/useDispatch";
import messageMap from "../contexts/messaging/messages";
import { messages } from "shared/messaging";

type Props = {
  roomCode: string;
  room: RoomState;
  users: User[];
};

export default function RoomPreview({ roomCode, room, users }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();

  const timeRemaining = useTimeRemaining(room.expiresAt);
  const timeInSeconds = Math.floor(timeRemaining / 1000);

  useEffect(() => {
    dispatch(new messages.WatchRoomDataMessage({ roomCode }));
  }, [dispatch, roomCode]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [timeRemaining, router]);

  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
      {timeRemaining === 0
        ? "La sala ha expirado. Volviendo al inicio..."
        : users.length > 1
          ? `${users[0].name} y ${users.length - 1} más están en esta sala`
          : users.length === 1
            ? `${users[0].name} está en esta sala`
            : `No hay usuarios conectados, la sala se eliminará en ${timeInSeconds} segundos`}
    </h2>
  );
}
