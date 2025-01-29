import { NextRequest, NextResponse } from "next/server";
import { addInterviewToQueue } from "../../../_firebase/queues";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const { queueName, interviewId, companyCode, stallName } =
      await request.json();

    if (!queueName) {
      return new NextResponse(
        JSON.stringify({ message: "Queue name is required" }),
        { status: 400 }
      );
    }

    

    await addInterviewToQueue({
      queueName,
      interviewId,
      companyCode,
      stallName,
    });

    return new NextResponse(
      JSON.stringify({ message: "Interview assigned successfully" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Error assigning interviews",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
