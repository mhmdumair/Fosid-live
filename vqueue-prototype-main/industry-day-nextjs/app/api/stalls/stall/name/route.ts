import { NextRequest, NextResponse } from "next/server";
import { getStallByName } from "@/app/api/_firebase/stalls";

/**
 * Handles POST request to fetch a stall by name.
 * @param {NextRequest} request
 * @returns {Promise<NextResponse>}
 */
export async function POST (request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name) {
      return new NextResponse(
        JSON.stringify({ error: "Stall name cannot be null" }),
        { status: 400 }
      );
    }

    const user = await getStallByName({ name });
    return new NextResponse(JSON.stringify({ user }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Stall not found", details: error.message }),
      { status: 404 }
    );
  }
}