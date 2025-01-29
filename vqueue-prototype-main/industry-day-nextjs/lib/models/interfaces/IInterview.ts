import { IStudent } from "../interfaces/IStudent";
import { IQueue } from "./IQueue";
import { InterviewType } from "../enums/InterviewType";
import { InterviewStatus } from "../enums/InterviewStatus";
import { Timestamp } from "firebase/firestore";
import { IStall } from "./IStall";
import { ICompany } from "./ICompany";

export interface IInterview {
  id: string;
  interviewId: string;
  studentRegNo: string;
  student?: IStudent;
  companyName: string;
  company?: ICompany;
  stallName?: string;
  stall?: IStall;
  isAssignedToQueue?: boolean;
  queueName?: string;
  queue?: IQueue;
  startTime?: Timestamp;
  preference?: number;
  status?: InterviewStatus;
  type: InterviewType;
  remark?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
  session?: string;
  position?: number;
}
