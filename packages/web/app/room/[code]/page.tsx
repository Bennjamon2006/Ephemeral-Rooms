import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomClient from "@/app/components/RoomClient";
import roomsService from "@/app/services/rooms.service";
import usersService from "@/app/services/users.service";
import messagesService from "@/app/services/messages.service";

type Params = {
  code: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function RoomPage({ params }: Props) {
  const { code } = await params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect(`/room/${code}/join`);
  }

  const username = cookieStore.get("username")?.value;

  if (!username) {
    redirect(`/room/${code}/join`);
  }

  const room = await roomsService.getRoomByCode(code);

  if (!room) {
    redirect("/");

    return;
  }

  const users = await usersService.getUsersInRoom(code);
  const onlineUsers = await usersService.getOnlineUsersInRoom(code);
  const messages = await messagesService.getMessagesInRoom(code);

  return (
    <RoomClient
      userId={userId}
      roomCode={code}
      initialUsers={users}
      initialOnlineUsers={onlineUsers}
      messages={messages}
    />
  );
}
