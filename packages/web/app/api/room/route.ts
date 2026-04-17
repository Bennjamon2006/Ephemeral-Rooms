import { NextResponse } from "next/server";
import createContainer from "@/app/container";

export async function POST() {
  try {
    const { roomsUseCases } = await createContainer();
    const room = await roomsUseCases.createRoom();

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}
