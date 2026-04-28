type TextMessage = {
  id: number;
  userId: string;
  content: string;
  timestamp: number;
  type: "text";
};

export type Events = "userJoined" | "userLeft";

type SystemMessage = {
  id: number;
  userId: string;
  event: Events;
  timestamp: number;
  type: "system";
};

export type Message = TextMessage | SystemMessage;
