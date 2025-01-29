import { PaginatedParams } from "./params";

export type CreateRoomInput = {
  stallIds?: string[];
  name: string;
  roomAdminId: string;
  departmentName: string;
  location?: string;
  blockNumber?: string;
};

export type UpdateRoomInput = {
  id: string;
  roomId: string;
  stallIds?: string[];
  name?: string;
  roomAdminId?: string;
  departmentName?: string;
  location?: string;
  blockNumber?: string;
};

export interface GetRoomsParams extends PaginatedParams {
  // role?: "student" | "admin" | "companyAdmin" | "roomAdmin";
}

export interface GetRoomParams {
  roomId: string;
  name?: string;
}

export interface GetRoomByNameParams {
  name: string;
}
