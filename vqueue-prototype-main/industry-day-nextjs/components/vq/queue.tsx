"use client";

import { IQueue } from "@/lib/models/interfaces/IQueue";
import { useEffect, useState } from "react";
import Indicator from "./indicator";
import { FaChevronLeft, FaClock } from "react-icons/fa";
import { timeString } from "@/lib/utils";
import { IInterview } from "@/lib/models/interfaces/IInterview";
import DateTime from "./date-time";
import { Button } from "../ui/button";
import { FaChevronRight } from "react-icons/fa6";

interface Props {
  id: string;
}

function InterviewSummary({
  interview,
  isCurrent = true,
}: {
  interview: IInterview;
  isCurrent?: boolean;
}) {
  return (
    <div className="w-full grid grid-cols-3 text-vq-secondary">
      {isCurrent ? (
        <div className="flex gap-1 items-center font-medium text-vq-failure">
          {interview && <FaClock />}
          <p>{timeString(interview?.startTime)}</p>
        </div>
      ) : (
        <div className="flex gap-1 items-center font-medium text-vq-blueGray">
          {interview && <FaClock />}
          <p>{timeString(interview?.startTime)}</p>
        </div>
      )}
      <div>{interview?.studentRegNo}</div>
      <div className="w-full flex justify-end items-center gap-2">
        <div>
          {interview?.type === "W"
            ? "WALK-IN"
            : interview?.type === "P"
            ? "PRE-LISTED"
            : ""}
        </div>
        <div>
          {interview?.status === "completed" && (
            <Indicator label="" type="success" />
          )}
          {interview?.status === "waiting" && (
            <Indicator label="" type="peach" />
          )}
          {interview?.status === "absent" && (
            <Indicator label="" type="failure" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Queue({ id }: Props) {
  const [queue, setQueue] = useState<IQueue>();

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch(`/api/queues/queue?id=${id}&isInterviews=true`);
      const data = await res.json();

      setQueue(data);
    } catch (error) {
      console.error("Error fetching queue:", error);
      throw new Error("Failed to fetch queue");
    }
  };

  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-full px-5 sm:px-16 pt-8 flex flex-col gap-5">
        <div>
          <div className="w-full flex items-center gap-2">
            <Button className="p-0 bg-transparent hover:bg-transparent text-vq-secondary hover:text-vq-failure">
              <FaChevronLeft />
            </Button>
            <div className="text-xl font-medium">{queue?.name}</div>
            <Button className="p-0 bg-transparent hover:bg-transparent text-vq-secondary hover:text-vq-failure">
              <FaChevronRight />
            </Button>
          </div>
          <h1 className="text-3xl font-bold">{queue?.stallName}</h1>
        </div>

        <DateTime />

        <div>
          <p className="text-vq-darkRose font-medium flex gap-4">
            {queue?.interviewIds?.length} interviews in queue
          </p>
        </div>

        <div className="bg-vq-pearl p-2 rounded-md w-full flex flex-col sm:flex-row justify-between gap-2">
          <Indicator label="Empty" type="success" />
          <Indicator label="Available" type="peach" />
          <Indicator label="Overloaded" type="failure" />
        </div>

        <div className="w-full bg-vq-white p-2 rounded-md border-vq-pearl border-2">
          <p className="font-medium pb-2">Current Interview</p>
          {queue?.interviews && (
            <InterviewSummary interview={queue?.interviews[0]} />
          )}
        </div>

        <div className="w-full bg-vq-white p-2 rounded-md border-vq-pearl border-2">
          <p className="font-medium">Next in line</p>
          {queue?.interviews &&
            queue.interviews
              .slice(1)
              .map((interview, index) => (
                <InterviewSummary key={index} interview={interview} />
              ))}
        </div>
      </div>
    </main>
  );
}
