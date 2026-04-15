import CustomButton from "@/app/components/Button";
import JoinClient from "@/app/components/JoinClient";
import roomsService from "@/app/services/rooms.service";
import usersService from "@/app/services/users.service";
import { Card } from "flowbite-react";
import { User } from "shared";

type Params = {
  code: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function Room({ params }: Props) {
  const resolvedParams = await params;

  const room = await roomsService.getRoomByCode(resolvedParams.code);

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sala no encontrada
          </h1>

          <p className="font-normal text-gray-700 dark:text-gray-400">
            La sala con el código &quot;{resolvedParams.code}&quot; no existe.
          </p>

          <div className="mt-6">
            <CustomButton variant="link" href="/">
              Volver al inicio
            </CustomButton>
          </div>
        </Card>
      </div>
    );
  }

  const users: User[] = room.empty
    ? []
    : await usersService.getUsersInRoom(resolvedParams.code);

  return (
    <JoinClient roomCode={resolvedParams.code} room={room} users={users} />
  );
}
