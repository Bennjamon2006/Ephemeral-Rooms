import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

  cookieStore.set(`room:${code}:username`, username, {
    path: `/room/${code}`,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
