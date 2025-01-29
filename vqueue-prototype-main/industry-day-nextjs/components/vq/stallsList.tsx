"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { DirectionType } from "@/lib/models/params/params";
import { GetStallsParams } from "@/lib/models/params/stall.params";
import StallsTable from "./stall-table";
import StallRecord from "./stall-record";
import { IStall } from "@/lib/models/interfaces/IStall";

// use table actions component
// dont use table component from shadcn ui
// create stall record component
// use proper callback function in table actions

export default function StallsList() {
  const [stalls, setStalls] = useState<IStall[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<DirectionType>("next");

  // Fetch the count of stalls to set pagination
  useEffect(() => {
    const fetchStallsCount = async () => {
      const res = await fetch("/api/stalls/count", {
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
          title: "Error fetching stalls",
          description: "Failed to fetch stalls",
          variant: "destructive",
        });
      }
    };

    fetchStallsCount();
    fetchStalls({ pageSize, direction });
  }, []);

  // Fetch stalls when page or direction changes
  useEffect(() => {
    console.log({ page, direction });
    if (direction === "next") {
      fetchStalls({ pageSize, last, direction });
    } else if (direction === "prev") {
      fetchStalls({ pageSize, first, direction });
    }
  }, [page, direction]);

  // Log stalls, page, first, and last for debugging
  useEffect(() => {
    console.log({ stalls, page, first, last });
  }, [stalls]);

  // Build query params for the API call
  const buildQueryParams = ({
    pageSize,
    last,
    first,
    direction,
  }: GetStallsParams): string => {
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

  // Fetch stalls from the API
  const fetchStalls = async ({
    pageSize = 10,
    last = undefined,
  }: GetStallsParams) => {
    try {
      const res = await fetch(
        `/api/stalls/?${buildQueryParams({
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
      const fetchedStalls = await res.json();
      const count = fetchedStalls.querySnapshot.length;

      setStalls(fetchedStalls.querySnapshot);
      setFirst(fetchedStalls.querySnapshot[0]?.stallid);
      setLast(fetchedStalls.querySnapshot[count - 1]?.stallid);

      // toast({
      //   title: "Stalls Fetch Successful",
      // });
    } catch (error) {
      console.error("Error fetching stalls:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching stalls. ${error}`,
      });
    }
  };

  // Handle previous page button click
  const prevPage = () => {
    setDirection("prev");
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Handle next page button click
  const nextPage = () => {
    setDirection("next");
    setPage((prevPage) => Math.min(prevPage + 1, pageCount));
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 p-10">
      <div className="w-full text-lg font-medium">Stalls</div>
      <div className="flex flex-col w-full">
        <StallsTable stalls={stalls} />
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="font-medium text-sm">Stalls per page: {pageSize}</span>
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
