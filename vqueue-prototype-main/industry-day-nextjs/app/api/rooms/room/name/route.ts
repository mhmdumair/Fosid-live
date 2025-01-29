import { NextRequest, NextResponse } from "next/server";
import { getRoomByName } from "@/app/api/_firebase/rooms";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (name == null) {
      return new NextResponse(
        JSON.stringify({ error: "Room name cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const room = await getRoomByName({ name });
    return new NextResponse(JSON.stringify({ room }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Room not found", details: error.message }),
      {
        status: 404,
      }
    );
  }
}
