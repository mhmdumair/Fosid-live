"use client";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { QueueStatus } from "@/lib/models/enums/QueueStatus";
import { IQueue } from "@/lib/models/interfaces/IQueue";
import {
  GetQueueParams,
  GetQueuesParams,
} from "@/lib/models/params/queue.params";
import { Button } from "@/components/ui/button";

interface Props {
  status?: QueueStatus;
}

export function QueueDetails({ queue }: { queue: IQueue }) {
  return (
    <div className="w-full p-5 text-sm">
      <p>{queue.id}</p>
      <p>{queue.name}</p>
      <p>{queue.queueStatus}</p>
      <p>{queue.createdAt?.toDate().toString()}</p>
    </div>
  );
}

export default function QueuesList({ status }: Props) {
  const [queues, setQueues] = useState<IQueue[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
    const fetchQueuesCount = async () => {
      try {
        const res = await fetch("/api/queues/count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPageCount(Math.ceil(data.count / pageSize));
        } else {
          throw new Error("Failed to fetch queues count");
        }
      } catch (error: any) {
        toast({
          title: "Error fetching queues",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchQueuesCount();
    fetchQueues({ queueStatus: status, pageSize, direction });
  }, []);

  useEffect(() => {
    if (direction === "next") {
      fetchQueues({ queueStatus: status, pageSize, last, direction });
    } else if (direction === "prev") {
      fetchQueues({ queueStatus: status, pageSize, first, direction });
    }
  }, [page, direction]);

  const buildQueryParams = ({
    // status,
    pageSize,
    last,
    first,
    direction,
  }: GetQueuesParams): string => {
    const params = new URLSearchParams();

    // if (status) {
    //   params.append("status", status.toString());
    // }

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
    queueStatus = undefined,
    pageSize = 10,
    last = undefined,
    first = undefined,
    direction,
  }: GetQueuesParams) => {
    try {
      const res = await fetch(
        `/api/queues/?${buildQueryParams({
          queueStatus,
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

      if (fetchedQueues.querySnapshot) {
        const count = fetchedQueues.querySnapshot.length;

        setQueues(fetchedQueues.querySnapshot);
        setFirst(fetchedQueues.querySnapshot[0]?.id);
        setLast(fetchedQueues.querySnapshot[count - 1]?.id);
      }
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
      <div className="w-full p-10 text-sm"></div>
      {queues?.map((queue) => (
        <QueueDetails key={queue.id} queue={queue} />
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
