import { NextResponse } from "next/server";
import { rooms } from "data";

export async function POST() {
  try {
    const room = await rooms.createRoom();

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}
