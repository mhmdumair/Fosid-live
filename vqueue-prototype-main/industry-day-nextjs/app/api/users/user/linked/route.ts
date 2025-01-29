import { NextRequest, NextResponse } from "next/server";
import { getUserByAuthId } from "../../../_firebase/users";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (id == null) {
      return new NextResponse(
        JSON.stringify({
          error: "User id for linked auth account cannot be null",
        }),
        {
          status: 404,
        }
      );
    }

    const user = await getUserByAuthId({ linkedAuthId: id });
    return new NextResponse(JSON.stringify({ user }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "User not found", details: error.message }),
      {
        status: 404,
      }
    );
  }
}
