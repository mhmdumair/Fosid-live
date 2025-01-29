import { NextRequest, NextResponse } from "next/server";
import {
  createRoom,
  deleteRoom,
  getRoom,
  updateRoom,
} from "../../_firebase/rooms";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id == null) {
      return new NextResponse(
        JSON.stringify({ error: "Room ID cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const room = await getRoom({ roomId: id });
    return new NextResponse(JSON.stringify({ room }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Room not found", details: error.message }),
      {
        status: 404,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      stallIds,
      name,
      roomAdminId,
      departmentName,
      location,
      blockNumber,
    } = await request.json();

    if (!departmentName) {
      return new NextResponse(
        JSON.stringify({ error: "Department Name is required" }),
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

    const newRoom = await createRoom({
      stallIds,
      name,
      roomAdminId,
      departmentName,
      location,
      blockNumber,
    });

    return new NextResponse(JSON.stringify({ room: newRoom }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Room could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { roomId, ...rest } = await request.json();

    if (!roomId) {
      return new NextResponse(
        JSON.stringify({ error: "Room ID is required" }),
        { status: 400 }
      );
    }

    const updatedRoom = await updateRoom({ roomId, ...rest });

    return new NextResponse(JSON.stringify({ user: updatedRoom }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Room could not be updated",
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
        JSON.stringify({ error: "Room ID is required" }),
        { status: 400 }
      );
    }

    await deleteRoom(id);

    return new NextResponse(
      JSON.stringify({ message: "Room deleted successfully", uid: id }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Room could not be deleted",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
