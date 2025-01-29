import { QueueStatus } from "../enums/QueueStatus";
import { PaginatedParams } from "./params";

export type CreateQueueInput = {
  name: string;
  stallName: string;
  interviewIds?: string[];
  queueStatus?: QueueStatus;
};

export type UpdateQueueInput = {
  id: string;
  queueId: string;
  name?: string;
  stallName?: string;
  interviewIds?: string[];
  queueStatus?: QueueStatus;
};

export interface GetQueuesParams extends PaginatedParams {
  stallName?: string;
  queueStatus?: QueueStatus
}

export interface GetQueueParams {
  queueId: string;
}

export interface GetQueueByNameStallNameParams {
  name: string;
  stallName: string;
}
