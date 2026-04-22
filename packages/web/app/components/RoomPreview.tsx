import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RoomState, User } from "shared/models";
import useTimeRemaining from "../hooks/useTimeRemaing";
import useRoomState from "../hooks/useRoomState";
import useOnlineUsers from "../hooks/useOnlineUsers";
import useUsers from "../hooks/useUsers";

type Props = {
  roomCode: string;
  room: RoomState;
  users: User[];
  onlineUsers: string[];
};

export default function RoomPreview({
  roomCode,
  room,
  users: initialUsers,
  onlineUsers: initialOnlineUsers,
}: Props) {
  const router = useRouter();

  const roomState = useRoomState(roomCode, room);
  const users = useUsers(initialUsers);
  const onlineUsers = useOnlineUsers(initialOnlineUsers);

  const activeUsers = onlineUsers
    .map((userId) => users.find((user) => user.id === userId))
    .filter((user): user is User => user !== undefined);

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
      {!roomState.empty && activeUsers.length === 0
        ? "Alguien está en la sala"
        : timeRemaining === 0
          ? "La sala ha expirado. Volviendo al inicio..."
          : activeUsers.length > 1
            ? `${activeUsers[0].name} y ${activeUsers.length - 1} más están en esta sala`
            : activeUsers.length === 1
              ? `${activeUsers[0].name} está en esta sala`
              : `No hay usuarios conectados, la sala se eliminará en ${timeInSeconds} segundos`}
    </h2>
  );
}
