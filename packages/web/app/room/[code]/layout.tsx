import MessagingProvider from "@/app/contexts/messaging/MessagingProvider";

interface RoomLayoutProps {
  children: React.ReactNode;
}

const url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

export default function RoomLayout({ children }: RoomLayoutProps) {
  return <MessagingProvider url={url}>{children}</MessagingProvider>;
}
