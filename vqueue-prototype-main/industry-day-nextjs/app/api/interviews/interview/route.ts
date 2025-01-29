import { NextRequest, NextResponse } from "next/server";
import {
  createInterview,
  deleteInterview,
  getInterview,
  updateInterview,
} from "../../_firebase/interviews";
import { CompanyCode } from "@/lib/models/enums/CompanyCodes";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Interview ID cannot be null" }),
        {
          status: 400,
        }
      );
    }

    const interview = await getInterview({ interviewId: id });
    if (!interview) {
      return new NextResponse(
        JSON.stringify({ error: "Interview not found" }),
        {
          status: 404,
        }
      );
    }

    return new NextResponse(JSON.stringify({ interview }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Error fetching interview",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentRegNo, stallName, ...interviewData } = await request.json();

    if (!studentRegNo) {
      return new NextResponse(
        JSON.stringify({ error: "Student Registration Number is required" }),
        {
          status: 400,
        }
      );
    }

    if (!stallName) {
      return new NextResponse(
        JSON.stringify({ error: "Stall Name is required" }),
        {
          status: 400,
        }
      );
    }

    const companyCode = stallName.slice(0, -1);
    const companyName = CompanyCode[companyCode as keyof typeof CompanyCode];

    const newInterview = await createInterview({
      studentRegNo,
      stallName,
      companyName,
      ...interviewData,
    });

    return new NextResponse(JSON.stringify({ interview: newInterview }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Interview could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { interviewId, ...rest } = await request.json();

    if (!interviewId) {
      return new NextResponse(
        JSON.stringify({ error: "Interview ID is required" }),
        { status: 400 }
      );
    }

    const updatedInterview = await updateInterview({ interviewId, ...rest });

    return new NextResponse(JSON.stringify({ interview: updatedInterview }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Interview could not be updated",
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
        JSON.stringify({ error: "Interview ID is required" }),
        { status: 400 }
      );
    }

    await deleteInterview(id);

    return new NextResponse(
      JSON.stringify({ message: "Interview deleted successfully", uid: id }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Interview could not be deleted",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
