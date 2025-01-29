import { NextRequest, NextResponse } from "next/server";
import { DirectionType } from "@/lib/models/params/params";
import { createRoomsBatch, getRooms } from "../_firebase/rooms";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const last = searchParams.get("last") ?? undefined;
  const first = searchParams.get("first") ?? undefined;
  const direction = (searchParams.get("direction") ?? "next") as DirectionType;

  try {
    const querySnapshot = await getRooms({
      pageSize: limit,
      last,
      first,
      direction,
    });

    return new NextResponse(JSON.stringify({ querySnapshot }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching rooms", error: error }),
      {
        status: 404,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { rooms } = await request.json();

    if (rooms.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Rooms array is empty" }),
        {
          status: 400,
        }
      );
    }

    const { createdRooms, existingRooms } = await createRoomsBatch(rooms);

    return new NextResponse(JSON.stringify({ createdRooms, existingRooms }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Rooms could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
