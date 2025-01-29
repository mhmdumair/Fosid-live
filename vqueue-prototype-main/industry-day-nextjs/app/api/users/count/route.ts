import { NextRequest, NextResponse } from "next/server";
import { getUsersCount } from "../../_firebase/users";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const count = await getUsersCount();

    return new NextResponse(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching users count", error: error }),
      {
        status: 404,
      }
    );
  }
}
