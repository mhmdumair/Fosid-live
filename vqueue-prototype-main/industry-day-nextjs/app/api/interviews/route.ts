import { NextRequest, NextResponse } from "next/server";
import {
  createInterviewsBatch,
  getInterviews,
} from "../../../app/api/_firebase/interviews";
import { GetInterviewsParams } from "@/lib/models/params/interview.params";
import { InterviewType } from "@/lib/models/enums/InterviewType";

/**
 * GET request to fetch a paginated list of interviews.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const last = searchParams.get("last");
    const first = searchParams.get("first");
    const directionParam = searchParams.get("direction");
    const studentRegNo = searchParams.get("studentRegNo");
    const stallName = searchParams.get("stallName");
    const isAssignedToQueue = searchParams.get("isAssignedToQueue") === "true";
    const type = searchParams.get("type") as InterviewType;
    const all = searchParams.get("all") === "true";

    let direction: GetInterviewsParams["direction"];
    if (directionParam === "next" || directionParam === "prev") {
      direction = directionParam;
    } else {
      direction = undefined;
    }

    const params: GetInterviewsParams = {
      pageSize,
      last: last || undefined,
      first: first || undefined,
      direction,
      type: type || undefined,
      studentRegNo: studentRegNo || undefined,
      isAssignedToQueue: isAssignedToQueue || undefined,
      all: all || undefined,
      stallName: stallName || undefined,
    };

    const interviews = await getInterviews(params);

    return new NextResponse(JSON.stringify({ interviews }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Error fetching interviews",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { interviews } = await request.json();

    if (interviews.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Interviews array is empty" }),
        {
          status: 400,
        }
      );
    }

    const { createdInterviews, existingInterviews, failedInterviews } =
      await createInterviewsBatch(interviews);

    return new NextResponse(
      JSON.stringify({
        createdInterviews,
        existingInterviews,
        failedInterviews,
      }),
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Interviews could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
