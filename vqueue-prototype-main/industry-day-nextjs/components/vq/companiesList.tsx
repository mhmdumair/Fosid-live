"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { DirectionType } from "@/lib/models/params/params";
import { GetCompaniesParams } from "@/lib/models/params/company.params";
import CompaniesTable from "./companies-table";
import { ICompany } from "@/lib/models/interfaces/ICompany";

// use table actions component
// dont use table component from shadcn ui
// create company record component
// use proper callback function in table actions

export default function CompaniesList() {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<DirectionType>("next");

  useEffect(() => {
    const fetchCompaniesCount = async () => {
      const res = await fetch("/api/companies/count", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setPageCount(Math.ceil(data.count / pageSize));
      } else {
        toast({
          title: "Error fetching companies",
          description: "Failed to fetch companies",
          variant: "destructive",
        });
      }
    };

    fetchCompaniesCount();
    fetchCompanies({ pageSize, direction });
  }, []);

  useEffect(() => {
    console.log({ page, direction });
    if (direction === "next") {
      fetchCompanies({ pageSize, last, direction });
    } else if (direction === "prev") {
      fetchCompanies({ pageSize, first, direction });
    }
  }, [page, direction]);

  useEffect(() => {
    console.log({ companies, page, first, last });
  }, [companies]);

  const buildQueryParams = ({
    pageSize,
    last,
    first,
    direction,
  }: GetCompaniesParams): string => {
    const params = new URLSearchParams();

    if (pageSize !== undefined) {
      params.append("limit", pageSize.toString());
    }

    if (direction !== undefined) {
      params.append("direction", direction);
    }

    if (direction === "prev" && first) {
      params.append("first", first);
    }

    if (direction === "next" && last) {
      params.append("last", last);
    }

    return params.toString();
  };

  const fetchCompanies = async ({
    pageSize = 10,
    last = undefined,
  }: GetCompaniesParams) => {
    /**
     * To get all companies with no limit: getCompanies({})
     * To get all companies with a limit of only 10 companies at a time: getCompanies({ pageSize: 10 })
     */

    try {
      const res = await fetch(
        `/api/companies/?${buildQueryParams({
          pageSize,
          first,
          last,
          direction,
        })}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const fetchedCompanies = await res.json();
      const count = fetchedCompanies.querySnapshot.length;

      setCompanies(fetchedCompanies.querySnapshot);
      setFirst(fetchedCompanies.querySnapshot[0]?.companyid);
      setLast(fetchedCompanies.querySnapshot[count - 1]?.companyid);

      // toast({
      //   title: "Companies Fetch Successful",
      // });
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching companies. ${error}`,
      });
    }
  };

  const prevPage = () => {
    setDirection("prev");
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setDirection("next");
    setPage((prevPage) => Math.min(prevPage + 1, pageCount));
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 p-10">
      <div className="w-full text-lg font-medium">Companies</div>
      <div className="flex flex-col w-full">
        <CompaniesTable companies={companies} />
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="font-medium text-sm">Companies per page: {pageSize}</span>
        <span className="font-bold">
          Page {page} of {pageCount}
        </span>
        <div className="flex gap-1">
          <Button onClick={prevPage} disabled={page === 1} size="sm" className="rounded-sm">
            Prev
          </Button>
          <Button onClick={nextPage} disabled={page === pageCount} size="sm" className="rounded-sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
