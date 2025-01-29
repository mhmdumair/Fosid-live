
import { NextRequest, NextResponse } from "next/server";
import { getStallsCount } from "../../_firebase/stalls";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const count = await getStallsCount();

    return new NextResponse(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching stalls count", error: error }),
      {
        status: 404,
      }
    );
  }
}