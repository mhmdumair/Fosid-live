import { NextRequest, NextResponse } from "next/server";
import { getInterviews } from "@/app/api/_firebase/interviews";

export async function POST(request: NextRequest) {
  try {
    const { studentRegNo, stallName } = await request.json();

    if (studentRegNo == null) {
      return new NextResponse(
        JSON.stringify({
          error: "Student Registration Number cannot be null",
        }),
        {
          status: 404,
        }
      );
    }

    const interviews = await getInterviews({ studentRegNo, stallName });

    return new NextResponse(JSON.stringify({ interviews }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Interviews not found", details: error.message }),
      {
        status: 404,
      }
    );
  }
}
