"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { DirectionType } from "@/lib/models/params/params";
import { GetQueuesParams } from "@/lib/models/params/queue.params";
import QueuesTable from "./queue-table";
import { IQueue } from "@/lib/models/interfaces/IQueue";

// use table actions component
// dont use table component from shadcn ui
// create user record compoennt
// use proper callback function in table actions

export default function QueuesList() {
  const [queues, setQueues] = useState<IQueue[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<DirectionType>("next");

  useEffect(() => {
    const fetchQueuesCount = async () => {
      const res = await fetch("/api/queues/count", {
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
          title: "Error fetching queues",
          description: "Failed to fetch queues",
          variant: "destructive",
        });
      }
    };

    fetchQueuesCount();
    fetchQueues({ pageSize, direction });
  }, []);

  useEffect(() => {
    console.log({ page, direction });
    if (direction === "next") {
      fetchQueues({ pageSize, last, direction });
    } else if (direction === "prev") {
      fetchQueues({ pageSize, first, direction });
    }
  }, [page, direction]);

  useEffect(() => {
    console.log({ queues, page, first, last });
  }, [queues]);

  const buildQueryParams = ({
    pageSize,
    last,
    first,
    direction,
  }: GetQueuesParams): string => {
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

  const fetchQueues = async ({
    pageSize = 10,
    last = undefined,
  }: GetQueuesParams) => {
     /**
     * To get all users with no limit: getUsers({})
     * To get all users with a limit of only 10 uers at a time: getUsers({ pageSize: 10 })
     */
    try {
      const res = await fetch(
        `/api/queues/?${buildQueryParams({
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
      const fetchedQueues = await res.json();
      const count = fetchedQueues.querySnapshot.length;

      setQueues(fetchedQueues.querySnapshot);
      setFirst(fetchedQueues.querySnapshot[0]?.queueId);
      setLast(fetchedQueues.querySnapshot[count - 1]?.queueId);

      // toast({
      //   title: "Users Fetch Successful",
      // });
    } catch (error) {
      console.error("Error fetching queues:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching queues. ${error}`,
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
      <div className="w-full text-lg font-medium">Queues</div>
      <div className="flex flex-col w-full">
        <QueuesTable queues={queues} />
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="font-medium text-sm">Queues per page: {pageSize}</span>
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
