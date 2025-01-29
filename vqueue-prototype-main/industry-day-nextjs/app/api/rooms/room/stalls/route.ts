import { getInterviews } from "@/app/api/_firebase/interviews";
import { getRoom } from "@/app/api/_firebase/rooms";
import { getStalls } from "@/app/api/_firebase/stalls";
import { IInterview } from "@/lib/models/interfaces/IInterview";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id, isInterviews } = await request.json();

    if (id == null) {
      return new NextResponse(
        JSON.stringify({ error: "Room Id cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const room = await getRoom({ roomId: id });
    const interviews: IInterview[] = [];

    if (room) {
      try {
        const stalls = await getStalls({ roomName: room.name });
        room.stalls = stalls;

        if (room.stalls && isInterviews) {
          const interviewsPromises = room.stalls.map((stall) =>
            getInterviews({ stallName: stall.name, all: true })
          );

          const interviewsResults = await Promise.all(interviewsPromises);
          interviewsResults.forEach((fetchedInterviews) => {
            interviews.push(...fetchedInterviews);
          });
        }
      } catch (error) {
        console.error("Error fetching stalls or interviews:", error);
        // Handle the error appropriately (e.g., show a message to the user)
      }
    }

    return new NextResponse(JSON.stringify({ room, interviews }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Room not found", details: error.message }),
      {
        status: 404,
      }
    );
  }
}
