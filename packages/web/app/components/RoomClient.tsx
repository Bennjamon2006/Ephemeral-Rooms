"use client";

import type { User, Message } from "shared/models";
import useDispatch from "../hooks/useDispatch";
import { useEffect } from "react";
import { messages as domainMessages } from "shared/messaging";
import UsersList from "./UsersList";
import MessageInput from "./MessageInput";
import MessagesList from "./MessagesList";
import useOnlineUsers from "../hooks/useOnlineUsers";
import useUsers from "../hooks/useUsers";
import useChatMessages from "../hooks/useChatMessages";

type Props = {
  userId: string;
  roomCode: string;
  initialUsers: User[];
  messages: Message[];
  initialOnlineUsers: string[];
};

export default function RoomClient({
  userId,
  roomCode,
  initialUsers,
  messages,
  initialOnlineUsers,
}: Props) {
  const dispatch = useDispatch();

  const users = useUsers(initialUsers);
  const onlineUsers = useOnlineUsers(initialOnlineUsers);
  const roomMessages = useChatMessages(messages);

  const activeUsers = onlineUsers
    .map((userId) => users.find((u) => u.id === userId))
    .filter((u): u is User => u !== undefined);

  useEffect(() => {
    dispatch(new domainMessages.commands.auth({ userId }));
  }, [userId, roomCode, dispatch]);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* HEADER */}
      <header className="h-14 flex items-center px-6 border-b border-gray-800 bg-gray-900">
        <h1 className="text-lg font-semibold tracking-wide">Sala {roomCode}</h1>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* USERS SIDEBAR */}
        <UsersList activeUsers={activeUsers} />

        {/* CHAT AREA */}
        <main className="flex-1 flex flex-col bg-gray-950">
          {/* messages */}
          <MessagesList messages={roomMessages} users={users} />

          {/* input placeholder */}
          <MessageInput />
        </main>
      </div>
    </div>
  );
}
