import WSProvider from "@/app/contexts/ws/WSProvider";

interface RoomLayoutProps {
  children: React.ReactNode;
}

const url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

export default function RoomLayout({ children }: RoomLayoutProps) {
  return <WSProvider url={url}>{children}</WSProvider>;
}
