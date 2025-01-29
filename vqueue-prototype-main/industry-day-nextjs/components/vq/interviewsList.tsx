"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { DirectionType } from "@/lib/models/params/params";
import { GetInterviewsParams } from "@/lib/models/params/interview.params";
import InterviewsTable from "./interviews-table";
import { IInterview } from "@/lib/models/interfaces/IInterview";

// use table actions component
// dont use table component from shadcn ui
// create user record compoennt
// use proper callback function in table actions

export default function InterviewsList() {
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<DirectionType>("next");

  useEffect(() => {
    const fetchInterviewsCount = async () => {
      const res = await fetch("/api/interviews/count", {
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
          title: "Error fetching interviews",
          description: "Failed to fetch interviews",
          variant: "destructive",
        });
      }
    };

    fetchInterviewsCount();
    fetchInterviews({ pageSize, direction });
  }, []);

  useEffect(() => {
    console.log({ page, direction });
    if (direction === "next") {
      fetchInterviews({ pageSize, last, direction });
    } else if (direction === "prev") {
      fetchInterviews({ pageSize, first, direction });
    }
  }, [page, direction]);

  useEffect(() => {
    console.log({ interviews, page, first, last });
  }, [interviews]);

  const buildQueryParams = ({
    pageSize,
    last,
    first,
    direction,
  }: GetInterviewsParams): string => {
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

  const fetchInterviews = async ({
    pageSize = 10,
    last = undefined,
  }: GetInterviewsParams) => {
    /**
     * To get all users with no limit: getUsers({})
     * To get all users with a limit of only 10 uers at a time: getUsers({ pageSize: 10 })
     */
    try {
      const res = await fetch(
        `/api/interviews/?${buildQueryParams({
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
      const fetchedInterviews = await res.json();
      const count = fetchedInterviews.querySnapshot.length;

      setInterviews(fetchedInterviews.querySnapshot);
      setFirst(fetchedInterviews.querySnapshot[0]?.interviewId);
      setLast(fetchedInterviews.querySnapshot[count - 1]?.interviewId);

      // toast({
      //   title: "Users Fetch Successful",
      // });
    } catch (error) {
      console.error("Error fetching interviews:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching interviews. ${error}`,
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
      <div className="w-full text-lg font-medium">Interviews</div>
      <div className="flex flex-col w-full">
        <InterviewsTable interviews={interviews} />
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="font-medium text-sm">Interviews per page: {pageSize}</span>
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
