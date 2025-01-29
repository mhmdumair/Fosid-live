import { NextRequest, NextResponse } from "next/server";
import {
  createCompaniesBatch,
  getCompanies,
  getCompaniesNames,
} from "../../_firebase/companies";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const querySnapshot = await getCompaniesNames();

    return new NextResponse(JSON.stringify({ querySnapshot }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching companies names", error: error }),
      {
        status: 404,
      }
    );
  }
}
