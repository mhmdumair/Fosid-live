import { ICompanyAdmin } from "../interfaces/ICompanyAdmin";
import { IRoomAdmin } from "../interfaces/IRoomAdmin";
import { IStudent } from "../interfaces/IStudent";
import { IUser } from "../interfaces/IUser";

export type UserUnion = IUser | IStudent | ICompanyAdmin | IRoomAdmin;
