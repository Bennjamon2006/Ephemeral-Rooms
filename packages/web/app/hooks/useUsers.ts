import { useEffect, useState } from "react";
import useMessage from "./useMessage";
import { User } from "shared/models";
import useDispatch from "./useDispatch";
import { messages } from "shared/messaging";

export default function useUsers(initialUsers: User[]) {
  const [users, setUsers] = useState(initialUsers);
  const dispatch = useDispatch();

  useMessage("userCreated", (message) => {
    const { user } = message.payload;

    setUsers((prevUsers) => [...prevUsers, user]);
  });

  useEffect(() => {
    dispatch(new messages.client.watchUserCreated());
  }, [dispatch]);

  return users;
}
