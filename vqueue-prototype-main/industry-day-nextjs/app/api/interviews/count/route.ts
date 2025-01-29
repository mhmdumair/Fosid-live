import { NextRequest, NextResponse } from "next/server";
import { getInterviewsCount } from "../../_firebase/interviews";

/**
 * Initial GET request to fetch the count of interviews from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const count = await getInterviewsCount();

    return new NextResponse(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching interviews count", error: error }),
      {
        status: 404,
      }
    );
  }
}
