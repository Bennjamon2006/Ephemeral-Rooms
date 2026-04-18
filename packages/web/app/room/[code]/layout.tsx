import MessagingProvider from "@/app/contexts/messaging/MessagingProvider";

const url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

type Params = {
  code: string;
};

interface Props {
  children: React.ReactNode;
  params: Promise<Params>;
}

export default async function RoomLayout({ children, params }: Props) {
  const { code } = await params;

  const roomUrl = `${url}?roomCode=${code}`;

  return <MessagingProvider url={roomUrl}>{children}</MessagingProvider>;
}
