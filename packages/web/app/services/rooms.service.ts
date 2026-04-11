import type { Message, Room, User } from "shared";

const mockRooms: Room[] = [
  {
    code: "NORMAL",
    id: "1",
  },
  {
    code: "EMPTYR",
    id: "2",
  },
  {
    code: "SPECIAL",
    id: "3",
  },
];

const users: Record<string, User[]> = {
  "1": [
    { id: "u1", name: "Alice" },
    { id: "u2", name: "Bob" },
  ],
  "2": [],
  "3": [{ id: "u3", name: "Charlie" }],
};

const messages: Record<string, Message[]> = {
  "1": [
    { id: "m1", content: "Hello!", userId: "u1", timestamp: new Date() },
    { id: "m2", content: "Hi there!", userId: "u2", timestamp: new Date() },
  ],
  "2": [],
  "3": [
    {
      id: "m3",
      content: "Welcome to the special room!",
      userId: "u3",
      timestamp: new Date(),
    },
  ],
};

const getRoomByCode = (code: string): Room | undefined => {
  return mockRooms.find((room) => room.code === code);
};

const getUsersInRoom = (roomId: string): User[] => {
  return users[roomId] || [];
};

const getMessagesInRoom = (roomId: string): Message[] => {
  return messages[roomId] || [];
};

const roomsService = {
  getRoomByCode,
  getUsersInRoom,
  getMessagesInRoom,
};

export default roomsService;
