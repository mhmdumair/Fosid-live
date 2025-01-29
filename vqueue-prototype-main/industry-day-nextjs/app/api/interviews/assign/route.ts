import { NextRequest, NextResponse } from "next/server";
import {
  addInterviewToQueue,
  autoAssignInterviewsToQueues,
} from "../../_firebase/queues";

// export interface IQueue {
//   id: string;
//   queueId: string;
//   name: string;
//   stallName: string;
//   stall?: IStall;
//   interviewIds?: string[];
//   interviews?: IInterview[];
//   queueStatus: QueueStatus;
//   createdAt: Timestamp;
//   updatedAt: Timestamp;
//   deletedAt?: Timestamp;
// }

// export interface IInterview {
//   id: string;
//   interviewId: string;
//   studentRegNo: string;
//   student?: IStudent;
//   companyName: string;
//   company?: ICompany;
//   stallName: string;
//   stall?: IStall;
//   queueName?: string;
//   queue?: IQueue;
//   startTime?: Timestamp;
//   status?: InterviewStatus;
//   interviewType: InterviewType;
//   remark?: string;
//   createdAt: Timestamp;
//   updatedAt: Timestamp;
//   deletedAt?: Timestamp;
// }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // const last = searchParams.get("last");

    const { queues } = await autoAssignInterviewsToQueues();

    return new NextResponse(JSON.stringify({ queues }), {
      status: 200,
    });
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
