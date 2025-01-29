import { NextRequest, NextResponse } from "next/server";
import { DirectionType } from "@/lib/models/params/params";
import { getMessages } from "@/lib/models/imessage";
import { GetMessagesParams } from "@/lib/models/params/imessage.params";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const last = searchParams.get("last") ?? undefined;
  const first = searchParams.get("first") ?? undefined;
  const direction = (searchParams.get("direction") ?? "next") as DirectionType;
  const email = searchParams.get("email") ?? undefined;
  const createdAt = searchParams.get("createdAt") ? new Date(searchParams.get("createdAt") as string) : undefined;

  try {
    const messages = await getMessages({
      pageSize,
      last,
      first,
      direction,
      email,
      createdAt,
    });

    return new NextResponse(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching messages", error: error.message }),
      { status: 404 }
    );
  }
}
