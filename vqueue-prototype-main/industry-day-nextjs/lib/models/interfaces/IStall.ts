import { IRoom } from "./IRoom";
import { IQueue } from "./IQueue";
import { ICompany } from "../interfaces/ICompany";
import { StallStatus } from "../enums/StallStatus";
import { Timestamp } from "firebase/firestore";

export interface IStall {
  id: string;
  stallId: string;
  name: string;
  roomName: string;
  room?: IRoom;
  queueCount?: number;
  queueNames?: string[];
  queues?: IQueue[];
  companyName: string;
  company?: ICompany;
  stallStatus: StallStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}
