

import { NextRequest, NextResponse } from "next/server";
import { getQueuesCount } from "../../_firebase/queues";

export async function GET(request: NextRequest) {
  try {
    const count = await getQueuesCount();
    return new NextResponse(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching queues count", error: error }),
      { status: 404 }
    );
  }
}
