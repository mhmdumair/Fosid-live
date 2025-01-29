import { type ClassValue, clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { appConfig } from "./config/app.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterData = (data: any) => {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );

  return filteredData;
};

export const timeString = (timestamp?: Timestamp) => {
  if (!timestamp) {
    return null;
  }

  const dateString = timestamp.toString();
  const date = new Date(dateString);
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return timeString;
};

export type Entities =
  | "users"
  | "rooms"
  | "stalls"
  | "companies"
  | "queues"
  | "interviews";

export type Entity =
  | "user"
  | "room"
  | "stall"
  | "company"
  | "queue"
  | "interview";

export const getEntities = (e: Entity) => {
  return e === "user"
    ? "users"
    : e === "room"
    ? "rooms"
    : e === "stall"
    ? "stalls"
    : e === "company"
    ? "companies"
    : e === "queue"
    ? "queues"
    : "interviews";
};

// Function to calculate the ending time
export const calculateEndTime = ({
  interviewIds,
  baseTime,
}: {
  interviewIds: string[];
  baseTime?: Timestamp;
}): Timestamp => {
  console.log(interviewIds.length);
  const startTime =
    baseTime instanceof Timestamp
      ? baseTime.toDate()
      : appConfig.queues.baseTime.toDate(); // Start time is 9:30 AM IST
  const interviewDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Calculate the end time by adding the total duration of all interviews to the start time
  const totalDuration = interviewIds.length * interviewDuration;
  const endTime = new Date(startTime.getTime() + totalDuration);

  return Timestamp.fromDate(endTime);
};
