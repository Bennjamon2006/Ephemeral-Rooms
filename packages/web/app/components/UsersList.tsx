import type { User } from "shared/models";
import useUsers from "../hooks/useUsers";
import useOnlineUsers from "../hooks/useOnlineUsers";

type Props = {
  initialUsers: User[];
  initialOnlineUsers: string[];
};

export default function UsersList({ initialUsers, initialOnlineUsers }: Props) {
  const users = useUsers(initialUsers);
  const onlineUsers = useOnlineUsers(initialOnlineUsers);

  const activeUsers = onlineUsers
    .map((userId) => users.find((u) => u.id === userId))
    .filter((u): u is User => u !== undefined);

  return (
    <aside className="w-56 border-r border-gray-800 bg-gray-900 p-3">
      <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
        Usuarios
      </h2>

      <ul className="space-y-2">
        {activeUsers.map((u, i) => (
          <li key={i} className="px-3 py-2 rounded bg-gray-800 text-sm">
            {u.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
