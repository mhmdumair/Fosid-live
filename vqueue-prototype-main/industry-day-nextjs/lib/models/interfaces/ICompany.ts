import { IStall } from "./IStall";
import { CompanyStatus } from "../enums/CompanyStatus";
import { Timestamp } from "firebase/firestore";

export interface ICompany {
  id: string;
  companyId: string;
  code?: string;
  name: string;
  email: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  stallNames: string[];
  stalls?: IStall[];
  status: CompanyStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}
