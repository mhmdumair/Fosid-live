import { NextRequest, NextResponse } from "next/server";
import { createUsersBatch, getUser, getUsers } from "../_firebase/users";
import { Role } from "@/lib/models/enums/Role";
import { DirectionType } from "@/lib/models/params/params";
import { getInterviews } from "../_firebase/interviews";
import { IStudent } from "@/lib/models/interfaces/IStudent";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const role = searchParams.get("role") as Role;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const last = searchParams.get("last") ?? undefined;
  const first = searchParams.get("first") ?? undefined;
  const direction = (searchParams.get("direction") ?? "next") as DirectionType;
  const isInterviews = searchParams.get("isInterviews") === "true";

  try {
    const querySnapshot = await getUsers({
      pageSize: limit,
      last,
      first,
      direction,
      role,
    });

    if (isInterviews && role === Role.STUDENT) {
      const fetchInterviewsPromises = querySnapshot.map(async (user) => {
        const student = user as IStudent;
        student.interviews = await getInterviews({
          studentRegNo: student.regNo,
        });
        user = student;
      });

      // Wait for all queue creation promises to complete
      await Promise.all(fetchInterviewsPromises);
    }

    return new NextResponse(JSON.stringify({ querySnapshot }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching users", error: error.message }),
      {
        status: 404,
      }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { users } = await request.json();

    if (users.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Users array is empty" }),
        {
          status: 400,
        }
      );
    }

    const { createdUsers, existingUsers } = await createUsersBatch(users);

    return new NextResponse(JSON.stringify({ createdUsers, existingUsers }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Users could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
