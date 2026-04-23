import { useState } from "react";
import useMessage from "./useMessage";

export default function useOnlineUsers(initialOnlineUsers: string[]) {
  const [onlineUsers, setOnlineUsers] = useState(initialOnlineUsers);

  useMessage("userJoined", (message) => {
    const { userId } = message.payload;

    if (!onlineUsers.includes(userId)) {
      setOnlineUsers((prevOnlineUsers) => {
        if (!prevOnlineUsers.includes(userId)) {
          return [...prevOnlineUsers, userId];
        }

        return prevOnlineUsers;
      });
    }
  });

  useMessage("userLeft", (message) => {
    const { userId } = message.payload;

    setOnlineUsers((prevOnlineUsers) =>
      prevOnlineUsers.filter((id) => id !== userId),
    );
  });

  return onlineUsers;
}
