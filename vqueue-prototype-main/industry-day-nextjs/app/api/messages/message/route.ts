import { NextRequest, NextResponse } from "next/server";
import { createMessage, updateMessage, deleteMessage, getMessage } from "@/lib/models/imessage";
import { IMessage } from "@/lib/models/interfaces/IMessage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Message ID is required" }),
        { status: 400 }
      );
    }

    const message = await getMessage(id);

    if (!message) {
      return new NextResponse(
        JSON.stringify({ error: "Message not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(message), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching message", error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message }: { message: IMessage } = await request.json();

    if (!message || !message.id) {
      return new NextResponse(
        JSON.stringify({ error: "Message content is missing" }),
        { status: 400 }
      );
    }

    const createdMessage = await createMessage(message);

    return new NextResponse(JSON.stringify(createdMessage), { status: 201 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Message could not be created", details: error.message }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { message }: { message: Partial<IMessage> } = await request.json();

    if (!message || !message.id) {
      return new NextResponse(
        JSON.stringify({ error: "Message ID is required for update" }),
        { status: 400 }
      );
    }

    const updatedMessage = await updateMessage(message);

    if (!updatedMessage) {
      return new NextResponse(
        JSON.stringify({ error: "Message could not be updated" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(updatedMessage), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Message could not be updated", details: error.message }),
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
        JSON.stringify({ error: "Message ID is required" }),
        { status: 400 }
      );
    }

    await deleteMessage(id);

    return new NextResponse(JSON.stringify({ message: "Message deleted successfully" }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Message could not be deleted", details: error.message }),
      { status: 500 }
    );
  }
}
