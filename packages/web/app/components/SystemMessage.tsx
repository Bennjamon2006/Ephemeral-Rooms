import type { Events } from "shared/models";

type Props = {
  event: Events;
  username: string;
  itsMe: boolean;
};

function messageContent(event: Events, username: string, itsMe: boolean) {
  if (event === "userJoined") {
    return itsMe
      ? "Te has unido a la sala"
      : `${username} se ha unido a la sala`;
  } else {
    return itsMe
      ? "Has abandonado la sala"
      : `${username} ha abandonado la sala`;
  }
}

export default function SystemMessage({ event, username, itsMe }: Props) {
  return (
    <div className="flex justify-center">
      <div className="max-w-xl px-4 py-2 rounded bg-gray-700 text-sm text-gray-300">
        <span className="text-gray-400">
          {messageContent(event, username, itsMe)}
        </span>
      </div>
    </div>
  );
}
