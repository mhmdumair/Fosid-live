import { IStall } from "./IStall";
import { IRoomAdmin } from "../interfaces/IRoomAdmin";
import { Department } from "../enums/Department";
import { Timestamp } from "firebase/firestore";

export interface IRoom {
  id: string;
  roomId: string;
  stallIds?: string[];
  stalls?: IStall[];
  name: string;
  roomAdminId: string;
  roomAdmin?: IRoomAdmin;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
  departmentName: string;
  department?: Department;
  location?: string;
  blockNumber?: string;
}
