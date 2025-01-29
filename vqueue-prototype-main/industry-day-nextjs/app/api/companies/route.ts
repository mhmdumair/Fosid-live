import { NextRequest, NextResponse } from "next/server";
import { DirectionType } from "@/lib/models/params/params";
import { createCompaniesBatch, getCompanies } from "../_firebase/companies";
import { IStall } from "@/lib/models/interfaces/IStall";
import { getStalls } from "../_firebase/stalls";

/**
 * Initial GET request to fetch users from the database.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const last = searchParams.get("last") ?? undefined;
  const first = searchParams.get("first") ?? undefined;
  const direction = (searchParams.get("direction") ?? "next") as DirectionType;
  const isStalls = searchParams.get("isStalls") === "true";
  const name = searchParams.get("name") ?? undefined;

  try {
    const querySnapshot = await getCompanies({
      pageSize: limit,
      last,
      first,
      direction,
      name,
    });

    if (isStalls) {
      const fetchStallsPromises = querySnapshot.map(async (company) => {
        const stalls = await getStalls({ companyName: company.name });
        company.stalls = stalls;
      });

      // Wait for all queue creation promises to complete
      await Promise.all(fetchStallsPromises);
    }

    return new NextResponse(JSON.stringify({ querySnapshot }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching companies", error: error }),
      {
        status: 404,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companies } = await request.json();

    if (companies.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Companies array is empty" }),
        {
          status: 400,
        }
      );
    }

    const { createdCompanies, existingCompanies } = await createCompaniesBatch(
      companies
    );

    return new NextResponse(
      JSON.stringify({ createdCompanies, existingCompanies }),
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Companies could not be created",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
