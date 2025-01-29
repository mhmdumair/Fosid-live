import { Timestamp } from "firebase/firestore";
import { PaginatedParams } from "./params";
import { InterviewStatus } from "../enums/InterviewStatus";
import { InterviewType } from "../enums/InterviewType";
import { IInterview } from "../interfaces/IInterview";

export type CreateInterviewInput = {
  studentRegNo: string;
  companyName?: string;
  stallName?: string;
  status?: InterviewStatus;
  type: InterviewType;
  remark?: string;
  position?: number;
};

export type UpdateInterviewInput = {
  id: string;
  interviewId: string;
  studentRegNo?: string;
  companyName?: string;
  stallName?: string;
  queueName?: string;
  startTime?: Timestamp;
  status?: InterviewStatus;
  type?: InterviewType;
  remark?: string;
  position?: number;
};

export interface GetInterviewsParams extends PaginatedParams {
  type?: InterviewType;
  status?: InterviewStatus;
  stallName?: string;
  queueName?: string;
  studentRegNo?: string;
  isAssignedToQueue?: boolean;
  all?: boolean;
}

export interface GetInterviewParams {
  interviewId: string;
}

export interface GetInterviewByStudentQueueCompanyParams {
  studentRegNo: string;
  companyName: string;
  queueName?: string;
}

export type AssignInterviewToQueueParams = {
  interviewId: string;
  studentRegNo?: string;
  companyName?: string;
  queueName?: string;
  startTime?: Timestamp;
  status?: InterviewStatus;
  type?: InterviewType;
  remark?: string;
};

export interface AddInterviewToQueueParams {
  interview: IInterview;
  queueId: string;
}
