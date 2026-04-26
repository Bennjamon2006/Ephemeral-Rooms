"use client";

import type { User, Message } from "shared/models";
import useDispatch from "../hooks/useDispatch";
import { useEffect } from "react";
import { messages } from "shared/messaging";
import UsersList from "./UsersList";
import MessageInput from "./MessageInput";

type Props = {
  userId: string;
  roomCode: string;
  users: User[];
  messages: Message[];
  onlineUsers: string[];
};

export default function RoomClient({
  userId,
  roomCode,
  users,
  messages: roomMessages,
  onlineUsers,
}: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Dispatching");

    dispatch(new messages.commands.auth({ userId }));
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
        <UsersList initialUsers={users} initialOnlineUsers={onlineUsers} />

        {/* CHAT AREA */}
        <main className="flex-1 flex flex-col bg-gray-950">
          {/* messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {roomMessages.map((m, i) => (
              <div key={i} className="max-w-xl px-4 py-2 rounded bg-gray-800">
                <span className="text-indigo-400 font-medium">{m.userId}</span>:{" "}
                {m.content}
              </div>
            ))}
          </div>

          {/* input placeholder */}
          <MessageInput
            onSend={(message) => {
              alert(`Send message: ${message}`);
            }}
          />
        </main>
      </div>
    </div>
  );
}
