"use client";

import { IStall } from "@/lib/models/interfaces/IStall";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import {
  FailureIndicator,
  PendingIndicator,
  SuccessIndicator,
} from "./indicator";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  roomId: string;
}

export default function StallsOfRoom({ roomId }: Props) {
  const [stalls, setStalls] = useState<IStall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchStalls({ roomId });
  }, [roomId]);

  const fetchStalls = async ({ roomId }: { roomId: string }) => {
    try {
      setIsLoading(true); // Start loading
      const res = await fetch(`/api/rooms/room/stalls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: roomId }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const fetchedStalls = data.room.stalls;

      // console.log("roomId: ", roomId);
      // console.log("Fetched stalls: ", fetchedStalls);

      setStalls(fetchedStalls);
      setIsLoading(false); // End loading
    } catch (error) {
      console.error("Error fetching stalls:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching stalls. ${error}`,
      });
    }
  };

  return (
    <>
      <ul className="w-full grid grid-cols-1 gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="bg-slate-200 h-40 w-full rounded-md"
              />
            ))
          : stalls?.map((stall) => (
              // <Link href={`/stalls/${stall.stallId}`} key={stall.stallId}>
              // <Link href={`#`} key={stall.stallId}>
              <div key={stall.stallId} className="group bg-slate-200 hover:bg-vq-primary rounded-sm p-2 flex justify-between">
                <div className="">
                  <p className="font-semibold">{stall.companyName}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {stall.queueCount || "--"} Queues
                  </p>
                </div>
                <div className="flex justify-between items-end flex-col">
                  <FaArrowRight className="text-vq-secondary -rotate-45" />
                  {stall.stallStatus === "open" && <SuccessIndicator />}
                  {stall.stallStatus === "temp_closed" && <PendingIndicator />}
                  {stall.stallStatus === "closed" && <FailureIndicator />}
                </div>
              </div>
              // </Link>
            ))}
      </ul>
      <div>{JSON.stringify(currentUser ?? "")}</div>
    </>
  );
}
