import { PaginatedParams } from "./params";

export type CreateUserInput = {
  name?: string;
  email: string;
  role: string;
  phone1?: string;
  phone2?: string;
  regNo?: string;
  group?: string;
  level?: string;
  companyName?: string;
  roomName?: string;
};

export type UpdateUserInput = {
  id: string;
  uid: string;
  name?: string;
  email?: string;
  role?: string;
  phone1?: string;
  phone2?: string;
  regNo?: string;
  group?: string;
  level?: string;
  companyName?: string;
  roomName?: string;
  linkedAuthId?: string;
};

export interface GetUsersParams extends PaginatedParams {
  role?: "student" | "admin" | "companyAdmin" | "roomAdmin";
}

export interface GetUserParams {
  uid: string;
}

export interface GetUserByLinkedAuthIdParams {
  linkedAuthId: string;
}

export interface GetUserByEmailParams {
  email: string;
}
