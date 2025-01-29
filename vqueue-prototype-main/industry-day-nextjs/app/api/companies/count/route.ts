import { NextRequest, NextResponse } from "next/server";
import { getCompaniesCount } from "../../_firebase/companies";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const count = await getCompaniesCount();

    return new NextResponse(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching companies count", error: error }),
      {
        status: 404,
      }
    );
  }
}
