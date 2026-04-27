import type { Message, User } from "shared/models";

type Props = {
  messages: Message[];
  users: User[];
};

export default function MessagesList({ messages, users }: Props) {
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3">
      {messages.map((m, i) => (
        <div key={i} className="max-w-xl px-4 py-2 rounded bg-gray-800">
          <span className="text-indigo-400 font-medium">
            {getUserName(m.userId)}
          </span>
          : {m.content}
        </div>
      ))}
    </div>
  );
}
