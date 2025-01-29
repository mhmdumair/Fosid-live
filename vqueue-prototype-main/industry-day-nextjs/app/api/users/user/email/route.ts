import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail,
} from "../../../_firebase/users";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (email == null) {
      return new NextResponse(
        JSON.stringify({ error: "User email cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const user = await getUserByEmail({ email });
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
