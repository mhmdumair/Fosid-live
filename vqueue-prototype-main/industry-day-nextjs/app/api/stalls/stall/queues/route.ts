import { getQueues } from "@/app/api/_firebase/queues";
import { getStall } from "@/app/api/_firebase/stalls";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (id == null) {
      return new NextResponse(
        JSON.stringify({ error: "Stall Id cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const stall = await getStall({ stallId: id });

    if (stall) {
      const queues = await getQueues({ stallName: stall.name });
      stall.queues = queues;
    }
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
