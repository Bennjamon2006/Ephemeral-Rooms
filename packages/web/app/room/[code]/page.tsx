import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Params = {
  code: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function RoomPage({ params }: Props) {
  const { code } = await params;

  const cookieStore = await cookies();
  const username = cookieStore.get(`room:${code}:username`)?.value;

  if (!username) {
    return redirect(`/room/${code}/join`);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Bienvenido a la sala {code}, {username}!
      </h1>
    </div>
  );
}
