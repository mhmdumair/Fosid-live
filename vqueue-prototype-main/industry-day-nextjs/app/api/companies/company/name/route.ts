import { NextRequest, NextResponse } from "next/server";
import { getCompanyByName } from "@/app/api/_firebase/companies";
import { getStalls } from "@/app/api/_firebase/stalls";

export async function POST(request: NextRequest) {
  try {
    const { name, isStalls } = await request.json();

    if (name == null) {
      return new NextResponse(
        JSON.stringify({ error: "Company name cannot be null" }),
        {
          status: 404,
        }
      );
    }

    const company = await getCompanyByName({ name });

    if (isStalls && company) {
      const stalls = await getStalls({ companyName: name });
      company.stalls = stalls;
    }

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
