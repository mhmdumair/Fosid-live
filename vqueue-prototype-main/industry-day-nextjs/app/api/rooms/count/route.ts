import { NextRequest, NextResponse } from "next/server";
import { getRoomsCount } from "../../_firebase/rooms";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const count = await getRoomsCount();

    return new NextResponse(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching rooms count", error: error }),
      {
        status: 404,
      }
    );
  }
}
