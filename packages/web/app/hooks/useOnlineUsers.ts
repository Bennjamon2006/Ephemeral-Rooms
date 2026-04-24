import { useEffect, useState } from "react";
import useMessage from "./useMessage";
import useDispatch from "./useDispatch";
import { messages } from "shared/messaging";

export default function useOnlineUsers(initialOnlineUsers: string[]) {
  const [onlineUsers, setOnlineUsers] = useState(initialOnlineUsers);
  const dispatch = useDispatch();

  useMessage("syncOnlineUsersResult", (message) => {
    const { onlineUsers } = message.payload;
    setOnlineUsers(onlineUsers);
  });

  useMessage("userJoined", (message) => {
    const { userId } = message.payload;

    setOnlineUsers((prevOnlineUsers) => {
      if (!prevOnlineUsers.includes(userId)) {
        return [...prevOnlineUsers, userId];
      }

      return prevOnlineUsers;
    });
  });

  useMessage("userLeft", (message) => {
    const { userId } = message.payload;

    setOnlineUsers((prevOnlineUsers) =>
      prevOnlineUsers.filter((id) => id !== userId),
    );
  });

  useEffect(() => {
    dispatch(new messages.commands.syncOnlineUsers());
  }, [dispatch]);

  return onlineUsers;
}
