"use client";

import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { InterviewType } from "@/lib/models/enums/InterviewType";
import { InterviewStatus } from "@/lib/models/enums/InterviewStatus";
import { IInterview } from "@/lib/models/interfaces/IInterview";
import { GetInterviewsParams } from "@/lib/models/params/interview.params";
import { Button } from "@/components/ui/button";

interface Props {
  type?: InterviewType;
  status?: InterviewStatus;
}

export function InterviewDetails({ interview }: { interview: IInterview }) {
  return (
    <div className="w-full p-5 text-sm">
      <p>{interview.id}</p>
      <p>{interview.studentRegNo}</p>
      <p>{interview.stallName}</p>
      <p>{interview.type}</p>
      <p>{interview.status}</p>
      <p>{interview.startTime?.toDate().toString()}</p>
    </div>
  );
}

export default function InterviewsList({ type, status }: Props) {
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<"next" | "prev">("next");

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
    fetchInterviews({ type, status, pageSize, direction });
  }, []);

  useEffect(() => {
    if (direction === "next") {
      fetchInterviews({ type, status, pageSize, last, direction });
    } else if (direction === "prev") {
      fetchInterviews({ type, status, pageSize, first, direction });
    }
  }, [page, direction]);

  const buildQueryParams = ({
    type,
    status,
    pageSize,
    last,
    first,
    direction,
  }: GetInterviewsParams): string => {
    const params = new URLSearchParams();

    if (type) {
      params.append("type", type);
    }

    if (status) {
      params.append("status", status.toString());
    }

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
    type = undefined,
    status = undefined,
    pageSize = 10,
    last = undefined,
    first = undefined,
    direction,
  }: GetInterviewsParams) => {
    try {
      const res = await fetch(
        `/api/interviews/?${buildQueryParams({
          type,
          status,
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

      if (fetchedInterviews.querySnapshot) {
        const count = fetchedInterviews.querySnapshot.length;

        setInterviews(fetchedInterviews.querySnapshot);
        setFirst(fetchedInterviews.querySnapshot[0]?.id);
        setLast(fetchedInterviews.querySnapshot[count - 1]?.id);
      }
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
      <div className="w-full p-10 text-sm"></div>
      {interviews?.map((interview) => (
        <InterviewDetails key={interview.id} interview={interview} />
      ))}
      <div className="flex gap-2">
        <Button onClick={prevPage} disabled={page === 1}>
          Prev
        </Button>
        <Button onClick={nextPage} disabled={page === pageCount}>
          Next
        </Button>
      </div>
    </div>
  );
}
