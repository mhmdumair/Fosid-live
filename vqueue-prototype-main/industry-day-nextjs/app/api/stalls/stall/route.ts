import { NextRequest, NextResponse } from "next/server";
import {
  createStall,
  deleteStall,
  getStall,
  updateStall,
} from "../../_firebase/stalls";
import { createQueuesBatch } from "../../_firebase/queues";
import { CreateQueueInput } from "@/lib/models/params/queue.params";
import { QueueStatus } from "@/lib/models/enums/QueueStatus";
import { IQueue } from "@/lib/models/interfaces/IQueue";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id == null) {
      return new NextResponse(
        JSON.stringify({ error: "Stall ID cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const stall = await getStall({ stallId: id });
    return new NextResponse(JSON.stringify({ stall }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Stall not found", details: error.message }),
      {
        status: 404,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, roomName, queueNames, companyName, stallStatus, queueCount } =
      await request.json();

    if (!roomName) {
      return new NextResponse(
        JSON.stringify({ error: "Room Name is required" }),
        {
          status: 400,
        }
      );
    }

    if (!name) {
      return new NextResponse(JSON.stringify({ error: "Name is required" }), {
        status: 400,
      });
    }

    if (!companyName) {
      return new NextResponse(
        JSON.stringify({ error: "Company name is required" }),
        {
          status: 400,
        }
      );
    }

    const newStall = await createStall({
      name,
      roomName,
      queueNames,
      companyName,
      stallStatus,
      queueCount,
    });

    // create the empty queues
    if (newStall && newStall.queueCount) {
      const queues: CreateQueueInput[] = [];
      for (let i = 0; i < newStall.queueCount; i++) {
        queues.push({
          name: `Q${i + 1}`,
          stallName: newStall.name,
          queueStatus: QueueStatus.EMPTY,
        });
      }

      const { createdQueues, existingQueues } = await createQueuesBatch(queues);

      if (createdQueues) {
        // Filter out null values
        newStall.queues = createdQueues.filter(
          (queue): queue is IQueue => queue !== null
        );
      }
    }

    return new NextResponse(JSON.stringify({ stall: newStall }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Stall could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { stallId, ...rest } = await request.json();

    if (!stallId) {
      return new NextResponse(
        JSON.stringify({ error: "Stall ID is required" }),
        { status: 400 }
      );
    }

    const updatedStall = await updateStall({ stallId, ...rest });

    return new NextResponse(JSON.stringify({ user: updatedStall }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Stall could not be updated",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Stall ID is required" }),
        { status: 400 }
      );
    }

    await deleteStall(id);

    return new NextResponse(
      JSON.stringify({ message: "Stall deleted successfully", uid: id }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Stall could not be deleted",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
