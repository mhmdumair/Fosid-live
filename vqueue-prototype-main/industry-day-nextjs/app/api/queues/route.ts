import { NextRequest, NextResponse } from "next/server";
import { DirectionType } from "@/lib/models/params/params";
import {
  createQueuesBatch,
  getQueues,
  updateQueuesBatch,
} from "../_firebase/queues";
import { getInterviews } from "../_firebase/interviews";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const last = searchParams.get("last") ?? undefined;
  const first = searchParams.get("first") ?? undefined;
  const direction = (searchParams.get("direction") ?? "next") as DirectionType;
  const stallName = searchParams.get("stallName") ?? undefined;
  const isInterviews = searchParams.get("isInterviews") === "true";
  const all = searchParams.get("all") === "true";

  try {
    const querySnapshot = await getQueues({
      pageSize: limit,
      last,
      first,
      direction,
      stallName,
    });

    if (isInterviews) {
      const fetchQueuesPromises = querySnapshot.map(async (queue) => {
        const interviews = await getInterviews({
          stallName,
          queueName: queue.name,
          all,
        });
        queue.interviews = interviews;
      });

      // Wait for all queue creation promises to complete
      await Promise.all(fetchQueuesPromises);
    }

    return new NextResponse(JSON.stringify({ querySnapshot }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching queues", error: error }),
      { status: 404 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { queues } = await request.json();

    if (queues.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Queues array is empty" }),
        {
          status: 400,
        }
      );
    }

    const { createdQueues, existingQueues } = await createQueuesBatch(queues);

    return new NextResponse(JSON.stringify({ createdQueues, existingQueues }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Queues could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { queues } = await request.json();

    if (queues.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Queues array is empty" }),
        {
          status: 400,
        }
      );
    }

    const { updatedQueues, nonExistingQueues } = await updateQueuesBatch(
      queues
    );

    return new NextResponse(
      JSON.stringify({ updatedQueues, nonExistingQueues }),
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Queues could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
