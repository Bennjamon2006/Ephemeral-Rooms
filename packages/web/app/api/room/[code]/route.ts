import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { rooms, users } from "application/use-cases";

type Params = {
  code: string;
};

type Body = {
  username: string;
};

type Context = {
  params: Promise<Params>;
};

export async function POST(req: NextRequest, { params }: Context) {
  const { code } = await params;
  const { username } = (await req.json()) as Body;

  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing room code" },
      { status: 400 },
    );
  }

  if (!username || typeof username !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing username" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();

  const existingUserId = cookieStore.get("userId")?.value;

  if (existingUserId) {
    const isUserInRoom = await users.checkUserInRoom(
      code,
      existingUserId,
      username,
    );

    if (isUserInRoom) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
  }

  const result = await users.addUserToRoom(code, username);

  cookieStore.set("userId", result.id, {
    path: `/room/${code}`,
  });

  cookieStore.set("username", username, {
    path: `/room/${code}`,
  }); // TEMPORAL, LUEGO SE DEBE OBTENER DEL BACKEND CON EL USER ID

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(req: NextRequest, { params }: Context) {
  const { code } = await params;

  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing room code" },
      { status: 400 },
    );
  }

  const room = await rooms.getRoomData(code);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ room }, { status: 200 });
}
