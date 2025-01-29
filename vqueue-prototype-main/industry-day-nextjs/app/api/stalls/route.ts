import { NextRequest, NextResponse } from "next/server";
import { DirectionType } from "@/lib/models/params/params";
import { createStallsBatch, getStalls } from "../_firebase/stalls";
import { CreateQueueInput } from "@/lib/models/params/queue.params";
import { QueueStatus } from "@/lib/models/enums/QueueStatus";
import { createQueuesBatch } from "../_firebase/queues";
import { IQueue } from "@/lib/models/interfaces/IQueue";

/**
 * Handles GET request to fetch stalls from the database.
 * @param {NextRequest} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const last = searchParams.get("last") ?? undefined;
  const first = searchParams.get("first") ?? undefined;
  const direction = (searchParams.get("direction") ?? "next") as DirectionType;
  const roomName = searchParams.get("roomName") ?? undefined;
  const companyName = searchParams.get("companyName") ?? undefined;

  try {
    const querySnapshot = await getStalls({
      pageSize: limit,
      last,
      first,
      direction,
      roomName,
      companyName,
    });

    return new NextResponse(JSON.stringify({ querySnapshot }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error fetching stalls",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { stalls } = await request.json();

    if (stalls.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Stalls array is empty" }),
        {
          status: 400,
        }
      );
    }

    const { createdStalls, existingStalls } = await createStallsBatch(stalls);

    // Create an array to hold all queue creation promises
    const queueCreationPromises = createdStalls.map(async (stall) => {
      if (stall && stall.queueCount) {
        const queues: CreateQueueInput[] = [];
        for (let i = 0; i < stall.queueCount; i++) {
          queues.push({
            name: `Q${i + 1}`,
            stallName: stall.name,
            queueStatus: QueueStatus.EMPTY,
          });
        }

        const { createdQueues } = await createQueuesBatch(queues);

        if (createdQueues) {
          // Filter out null values
          stall.queues = createdQueues.filter(
            (queue): queue is IQueue => queue !== null
          );
        }
      }
    });

    // Wait for all queue creation promises to complete
    await Promise.all(queueCreationPromises);

    return new NextResponse(JSON.stringify({ createdStalls, existingStalls }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Stalls could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
