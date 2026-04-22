"use client";

import type { User, Message } from "shared/models";
import useDispatch from "../hooks/useDispatch";
import { useEffect } from "react";
import { messages } from "shared/messaging";

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
    dispatch(new messages.client.auth({ userId }));
  }, [userId, roomCode]);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* HEADER */}
      <header className="h-14 flex items-center px-6 border-b border-gray-800 bg-gray-900">
        <h1 className="text-lg font-semibold tracking-wide">Sala {roomCode}</h1>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* USERS SIDEBAR */}
        <aside className="w-56 border-r border-gray-800 bg-gray-900 p-3">
          <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
            Usuarios
          </h2>

          <ul className="space-y-2">
            {users.map((u, i) => (
              <li key={i} className="px-3 py-2 rounded bg-gray-800 text-sm">
                {u.name}
              </li>
            ))}
          </ul>
        </aside>

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
          <div className="border-t border-gray-800 p-4">
            <input
              className="w-full bg-gray-900 border border-gray-800 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Escribe un mensaje..."
            />
          </div>
        </main>
      </div>
    </div>
  );
}
