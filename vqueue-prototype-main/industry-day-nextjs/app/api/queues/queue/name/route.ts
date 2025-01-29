import { NextRequest, NextResponse } from "next/server";
import { getQueueByNameStallName } from "../../../_firebase/queues";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const stallName = searchParams.get("stallName");

  if (!name) {
    return new NextResponse(
      JSON.stringify({ message: "Queue name is required" }),
      { status: 400 }
    );
  }

  if (!stallName) {
    return new NextResponse(
      JSON.stringify({ message: "Stall stallName is required" }),
      { status: 400 }
    );
  }

  try {
    const queue = await getQueueByNameStallName({ name, stallName });
    return new NextResponse(JSON.stringify(queue), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching queue", error: error }),
      { status: 404 }
    );
  }
}
