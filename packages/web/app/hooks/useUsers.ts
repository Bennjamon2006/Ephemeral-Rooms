import { useEffect, useState } from "react";
import useMessage from "./useMessage";
import { User } from "shared/models";
import useDispatch from "./useDispatch";
import { messages } from "shared/messaging";

export default function useUsers(initialUsers: User[]) {
  const [users, setUsers] = useState(initialUsers);
  const dispatch = useDispatch();

  useMessage("syncUsersResult", (message) => {
    const { users } = message.payload;
    setUsers(users);
  });

  useMessage("userCreated", (message) => {
    const { user } = message.payload;

    setUsers((prevUsers) => [...prevUsers, user]);
  });

  useEffect(() => {
    dispatch(new messages.commands.watchUserCreated());
    dispatch(new messages.commands.syncUsers());
  }, [dispatch]);

  return users;
}
