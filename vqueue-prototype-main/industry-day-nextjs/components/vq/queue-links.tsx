// TODO: get rooms from firebase

"use client";

import { IRoom } from "@/lib/models/interfaces/IRoom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { DirectionType } from "@/lib/models/params/params";
import { toast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Indicator from "./indicator";
import QueuesOfStall from "./queues-of-stall";
import { GetQueuesParams } from "@/lib/models/params/queue.params";
import { QueueStatus } from "@/lib/models/enums/QueueStatus";
import { IQueue } from "@/lib/models/interfaces/IQueue";
import { IStall } from "@/lib/models/interfaces/IStall";

interface QueueLinkProps {
  id: string;
  name: string;
  stallName?: string;
  queueStatus?: QueueStatus;
}

interface StallLinkProps {
  stall: IStall;
  name: string;
  roomName?: string;
  companyName?: string;
}

interface StallLinkFooterProps {
  stall: IStall;
  name: string;
  roomName?: string;
  companyName?: string;
}

function StallLinkFooter({
  stall,
  name,
  roomName,
  companyName,
}: StallLinkFooterProps) {
  return (
    <Dialog>
      <DialogTrigger className="font-medium w-full bg-vq-gold rounded-b-md py-2 text-[12px] group-hover:bg-stone-500 inline-flex justify-center items-center text-vq-secondary group-hover:text-vq-white">
        <FaArrowRight className="-rotate-45 mr-2" />
        View
      </DialogTrigger>
      <DialogContent className="w-80 sm:w-full rounded-md">
        <DialogHeader>
          <DialogTitle className="text-3xl">{name}</DialogTitle>
          <DialogDescription className="text-vq-secondary font-medium flex gap-4">
            <span>{roomName}</span>
            <span className="text-vq-stale">{companyName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col sm:flex-row justify-between gap-2">
          <Indicator label="Empty" type="success" />
          <Indicator label="Available" type="peach" />
          <Indicator label="Overloaded" type="failure" />
        </div>
        <QueuesOfStall stall={stall} />
      </DialogContent>
    </Dialog>
  );
}

function StallLink({ stall, name, roomName, companyName }: StallLinkProps) {
  return (
    <Card
      key={name}
      className="border- group hover:border-stone-300  bg-lime-50 hover:bg-stone-50 flex flex-col justify-between"
    >
      <CardHeader className="pb-0">
        <CardTitle className="text-gray-700 text-3xl">{name}</CardTitle>
        <CardDescription className="text-vq-secondary text-xs">
          {roomName}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2"></CardContent>
      <CardFooter className="p-0 bg-vq-pearl rounded-b-md">
        <StallLinkFooter
          stall={stall}
          name={name}
          roomName={roomName}
          companyName={companyName}
        />
      </CardFooter>
    </Card>
  );
}

function QueueLink({ id, name, queueStatus, stallName }: QueueLinkProps) {
  return (
    <Card key={id} className="bg-vq-white flex flex-col justify-between">
      <CardHeader className="pb-0">
        <CardTitle className="text-vq-secondary text-2xl">{name}</CardTitle>
        <CardDescription className="text-vq-stale text-xs">
          {stallName}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* {stalls?.map((stall) => (
            <StallLink
              key={stall.stallId}
              id={stall.stallId}
              name={stall.name}
              roomName={stall.roomName}
              companyName={stall.companyName}
            />
          ))} */}
        </div>
      </CardContent>
    </Card>
  );
}

export default function QueueLinks() {
  const [queues, setQueues] = useState<IQueue[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<DirectionType>("next");

  const [isLoading, setIsLoading] = useState(true);

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
          title: "Error fetching queues count",
          description: "Failed to fetch queues count",
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
    try {
      setIsLoading(true); // Start loading
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
      setIsLoading(false); // End loading
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
    <div className="w-full">
      <ul className="w-full grid grid-cols-2 gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="bg-vq-pearl h-40 w-full rounded-md"
              />
            ))
          : queues?.map((queue) => (
              <QueueLink
                key={queue.id}
                id={queue.id}
                name={queue.name}
                stallName={queue.stallName}
                queueStatus={queue.queueStatus}
              />
            ))}
      </ul>
      <div className="flex justify-between items-center w-full mt-5 p-4 bg-vq-pearl rounded-lg">
        <span className="font-medium text-sm">Stalls per page: {pageSize}</span>
        <span className="font-bold">
          Page {page} of {pageCount}
        </span>
        <div className="flex gap-1">
          <Button
            onClick={prevPage}
            disabled={page === 1}
            size="sm"
            className="rounded-sm"
          >
            Prev
          </Button>
          <Button
            onClick={nextPage}
            disabled={page === pageCount}
            size="sm"
            className="rounded-sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
