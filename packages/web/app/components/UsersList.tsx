import type { User } from "shared/models";

type Props = {
  activeUsers: User[];
};

export default function UsersList({ activeUsers }: Props) {
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
