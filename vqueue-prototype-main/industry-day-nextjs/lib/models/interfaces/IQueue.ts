import { IInterview } from "./IInterview";
import { QueueStatus } from "../enums/QueueStatus";
import { Timestamp } from "firebase/firestore";
import { IStall } from "./IStall";

export interface IQueue {
  id: string;
  queueId: string;
  name: string;
  stallName: string;
  stall?: IStall;
  interviewIds?: string[];
  interviews?: IInterview[];
  queueStatus: QueueStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
  baseTime?: Timestamp;
}
