import { NextRequest, NextResponse } from "next/server";
import {
  getQueueById,
  createQueue,
  updateQueue,
  deleteQueue,
} from "../../_firebase/queues";
import { getInterview } from "../../_firebase/interviews";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queueId = searchParams.get("id");
  const isInterviews = searchParams.get("isInterviews") === "true";

  if (!queueId) {
    return new NextResponse(
      JSON.stringify({ message: "Queue ID is required" }),
      { status: 400 }
    );
  }

  try {
    const queue = await getQueueById({ queueId });

    if (isInterviews && queue) {
      const interviews = await Promise.all(
        (queue?.interviewIds || []).map(async (id) => {
          const interview = await getInterview({ interviewId: id });
          return interview;
        })
      );

      // Add interviews to the queue object if needed
      queue.interviews = interviews.filter((interview) => interview !== null);
    }
    return new NextResponse(JSON.stringify(queue), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching queue", error: error }),
      { status: 404 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { name, stallName } = data;

    if (!name) {
      return new NextResponse(
        JSON.stringify({ message: "Queue name is required" }),
        { status: 400 }
      );
    }

    if (!stallName) {
      return new NextResponse(
        JSON.stringify({ message: "Stall name is required" }),
        { status: 400 }
      );
    }

    const newQueue = await createQueue(data);
    return new NextResponse(JSON.stringify(newQueue), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error creating queue", error: error }),
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { queueId, ...rest } = await request.json();

    if (!queueId) {
      return new NextResponse(
        JSON.stringify({ error: "Queue ID is required" }),
        { status: 400 }
      );
    }

    const updatedQueue = await updateQueue({ queueId, ...rest });

    return new NextResponse(JSON.stringify(updatedQueue), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Queue could not be updated",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queueId = searchParams.get("id");

  if (!queueId) {
    return new NextResponse(
      JSON.stringify({ message: "Queue ID is required" }),
      { status: 400 }
    );
  }

  try {
    await deleteQueue(queueId);
    return new NextResponse(
      JSON.stringify({ message: "Queue deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error deleting queue", error: error }),
      { status: 404 }
    );
  }
}
