import { Role } from "../enums/Role";
import { IRole } from "./IRole";
import { Timestamp } from "firebase/firestore";

export interface IUser {
  id: string;
  uid: string;
  // role: IRole;
  role: Role;
  name?: string;
  email: string;
  username: string;
  phone1: string;
  phone2?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
  linkedAuthId?: string;
}
