"use client";

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
import { IQueue } from "@/lib/models/interfaces/IQueue";
import { Button } from "../ui/button";
import Time from "./time";
import { UserUnion } from "@/lib/models/unions/user.union";
import { IStall } from "@/lib/models/interfaces/IStall";
import { IInterview } from "@/lib/models/interfaces/IInterview";
import { IStudent } from "@/lib/models/interfaces/IStudent";
import { Timestamp } from "firebase/firestore";

interface Props {
  user?: UserUnion;
  stall: IStall;
}

interface QueueCtaProps {
  queueName?: string;
  joined?: boolean;
  time?: any;
  onJoin?: () => void;
}

function QueueCta({ queueName, joined = false, time, onJoin }: QueueCtaProps) {
  return (
    <div className="w-full flex justify-between items-center py-2">
      {!joined ? (
        <>
          <div className="text-sm font-medium text-blue-500">
            You&apos;re not yet in a queue for this company. Want to join?
          </div>
          <Button className="h-6 hover:bg-slate-700" onClick={onJoin}>
            Join
          </Button>
        </>
      ) : (
        <>
          <div className="text-sm font-medium text-blue-500">
            Your interview has been scheduled in {queueName}
          </div>
          <Time inputDate={time} />
        </>
      )}
    </div>
  );
}

export default function QueuesOfStall({ stall, user }: Props) {
  const [currentUser, setCurrentUser] = useState<any>();
  const [queues, setQueues] = useState<IQueue[]>([]);
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (stall) {
      console.log("stall recieved: ", stall);
      fetchQueues({ stallId: stall.id });
    }
  }, [stall]);

  useEffect(() => {
    if (user && stall) {
      const student = user as IStudent;
      setCurrentUser(student);
      console.log("user recieved: ", user);
    }
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      fetchInterviewsForUser({
        studentRegNo: currentUser.regNo,
        stallName: stall.name,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (queues) {
      console.log(
        "queues recieved: ",
        queues.map((q) => q.interviewIds?.length)
      );
    }
  }, [queues]);

  const fetchQueues = async ({ stallId }: { stallId: string }) => {
    try {
      setIsLoading(true); // Start loading
      const res = await fetch(`/api/stalls/stall/queues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: stallId }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const fetchedQueues = data.stall.queues;

      setQueues(fetchedQueues);
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

  const fetchInterviewsForUser = async ({
    studentRegNo,
    stallName,
  }: {
    studentRegNo: string;
    stallName: string;
  }) => {
    try {
      if (studentRegNo) {
        // setIsLoading(true); // Start loading
        const res = await fetch(`/api/users/user/interviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentRegNo, stallName }),
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const fetchedInterviews = data.interviews;

        console.log("fetchedInterviews: ", fetchedInterviews);

        setInterviews(fetchedInterviews);
        setIsLoading(false); // End loading
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

  const getQueueWithFewestInterviews = (queues: IQueue[]) => {
    if (!queues || queues.length === 0) {
      throw new Error("No queues available");
    }

    // Sort queues by name
    queues.sort((a, b) => a.name.localeCompare(b.name));

    // Find the queue with the minimum number of interviewIds
    let minQueue = queues[0];
    let minCount = minQueue.interviewIds ? minQueue.interviewIds.length : 0;

    for (let i = 1; i < queues.length; i++) {
      const currentQueue = queues[i];
      const currentCount = currentQueue.interviewIds
        ? currentQueue.interviewIds.length
        : 0;

      if (currentCount < minCount) {
        minQueue = currentQueue;
        minCount = currentCount;
      } else if (currentCount === minCount) {
        // Tie breaking by lexicographical order of queue names
        if (currentQueue.name < minQueue.name) {
          minQueue = currentQueue;
        }
      }
    }

    return minQueue;
  };

  const handleOnJoin = async () => {
    console.log("Joining interview...");
    const minQueue = getQueueWithFewestInterviews(queues);

    if (minQueue) {
      console.log("minQueue: ", minQueue);

      if (!currentUser?.regNo) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Only a student can join an interview",
        });
      } else {
        const interviewRes = await fetch(`/api/interviews/interview`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentRegNo: currentUser?.regNo,
            stallName: minQueue?.stallName,
          }),
        });

        if (!interviewRes.ok) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "There was an issue creating the interview. Please try again",
          });
        } else {
          const data = await interviewRes.json();
          console.log("interview: ", data?.interview);

          const assignRes = await fetch(`/api/interviews/interview/assign`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              queueName: minQueue?.name,
              interviewId: data?.interview?.id,
              stallName: minQueue?.stallName,
            }),
          });

          if (!assignRes.ok) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:
                "There was an issue assigning the interview. Please try again",
            });
          }

          setInterviews([...interviews, data?.interview]);

          toast({
            title: "Interview joined successfully",
          });
        }
      }
    }
  };

  return (
    <>
      <div className="w-full bg-red-50 border-2 border-dashed border-red-300 rounded-md p-2">
        <div className="font-medium text-red-500">Disclaimer</div>
        <div className="text-sm text-slate-700 text-justify">
          If all queues are overloaded, you can join for interview but we cannot
          garunteed that you will be interviewd.
        </div>
      </div>
      <QueueCta
        joined={interviews.length > 0}
        queueName={interviews[0]?.queueName}
        time={interviews[0]?.startTime}
        onJoin={handleOnJoin}
      />
      <ul className="w-full grid grid-cols-1 gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="bg-slate-100 h-40 w-full rounded-md"
              />
            ))
          : queues?.map((queue) => (
              // <Link href={`/queues/${queue.queueId}`} key={queue.queueId}>
              <div
                key={queue.queueId}
                className="group bg-slate-100 hover:bg-blue-100 rounded-sm"
              >
                <div className=" p-2 flex justify-between gap-4">
                  <div className="w-full">
                    <p className="font-semibold text-lg">{queue.name}</p>
                    <p className="text-sm font-medium text-slate-500">
                      {queue.interviewIds?.length} in queue
                    </p>
                    {/* <p className="text-xs text-vq-darkRose font-medium">
                      12 in Queue
                    </p> */}
                  </div>
                  <div className="flex justify-between items-end flex-col">
                    {/* <FaArrowRight className="text-vq-secondary -rotate-45" /> */}
                    {queue.queueStatus === "empty" && <SuccessIndicator />}
                    {queue.queueStatus === "available" && <PendingIndicator />}
                    {queue.queueStatus === "overloaded" && <FailureIndicator />}
                  </div>
                </div>
                {/* <QueueCta /> */}
                {}
              </div>
              // </Link>
            ))}
      </ul>
    </>
  );
}
