import { NextRequest, NextResponse } from "next/server";
import { getStallsNames } from "../../_firebase/stalls";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const roomName = searchParams.get("roomName") ?? undefined;
  const companyName = searchParams.get("companyName") ?? undefined;

  try {
    const querySnapshot = await getStallsNames({
      roomName,
      companyName,
    });

    return new NextResponse(JSON.stringify({ querySnapshot }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error fetching stalls names",
        error: error,
      }),
      {
        status: 404,
      }
    );
  }
}
