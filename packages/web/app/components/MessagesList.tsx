import type { Message, User } from "shared/models";
import MessageItem from "./Message";

type Props = {
  messages: Message[];
  users: User[];
  userId: string;
};

export default function MessagesList({ messages, users, userId: me }: Props) {
  const getUserName = (userId: string) => {
    if (userId === me) {
      return "Tú";
    }

    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3">
      {messages.map((m, i) => (
        <MessageItem
          key={i}
          content={m.content}
          username={getUserName(m.userId)}
          itsMe={m.userId === me}
        />
      ))}
    </div>
  );
}
