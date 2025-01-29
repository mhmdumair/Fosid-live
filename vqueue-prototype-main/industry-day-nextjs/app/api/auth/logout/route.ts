import { firebaseAuth } from "@/lib/services/firebase";
import { signOut } from "firebase/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await signOut(firebaseAuth);

    // cookies().delete("currentUser");
    // cookies().delete("accessToken");

    return new NextResponse(
      JSON.stringify({
        message: "Sign out successful",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error signing out",
        error: error,
      }),
      {
        status: 404,
      }
    );
  }
}
