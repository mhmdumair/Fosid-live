import { NextRequest, NextResponse } from "next/server";
import {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
} from "../../_firebase/companies";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id == null) {
      return new NextResponse(
        JSON.stringify({ error: "Company ID cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const company = await getCompany({ companyId: id });
    return new NextResponse(JSON.stringify({ company }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Company not found", details: error.message }),
      {
        status: 404,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, address, phone1, phone2, status } =
      await request.json();

    if (!name) {
      return new NextResponse(
        JSON.stringify({ error: "Company Name is required" }),
        {
          status: 400,
        }
      );
    }

    if (!email) {
      return new NextResponse(
        JSON.stringify({ error: "Comapny Email is required" }),
        {
          status: 400,
        }
      );
    }

    const newCompany = await createCompany({
      name,
      email,
      address,
      phone1,
      phone2,
      status,
    });

    return new NextResponse(JSON.stringify({ company: newCompany }), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Company could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { companyId, ...rest } = await request.json();

    if (!companyId) {
      return new NextResponse(
        JSON.stringify({ error: "Company ID is required" }),
        { status: 400 }
      );
    }

    console.log(...rest);

    const updatedCompany = await updateCompany({ companyId, ...rest });

    return new NextResponse(JSON.stringify({ company: updatedCompany }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Company could not be updated",
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
        JSON.stringify({ error: "Company ID is required" }),
        { status: 400 }
      );
    }

    await deleteCompany(id);

    return new NextResponse(
      JSON.stringify({ message: "Company deleted successfully", id: id }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Company could not be deleted",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
