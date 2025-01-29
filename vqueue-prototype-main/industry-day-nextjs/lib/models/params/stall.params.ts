import { StallStatus } from "../enums/StallStatus";
import { PaginatedParams } from "./params";

export type CreateStallInput = {
  name: string;
  roomName: string;
  queueNames?: string[];
  companyName: string;
  stallStatus?: StallStatus;
  queueCount?: number;
};

export type UpdateStallInput = {
  id: string;
  stallId: string;
  name?: string;
  roomName?: string;
  queueNames?: string[];
  companyName?: string;
  stallStatus?: StallStatus;
  queueCount?: number;
};

export interface GetStallsParams extends PaginatedParams {
  roomName?: string;
  companyName?: string;
  all?: boolean;
  namesOnly?: boolean;
}

export interface GetStallParams {
  stallId: string;
}

export interface GetStallByNameParams {
  name: string;
  companyName?: string;
}
