import { IUser } from "./IUser";
import { StudentGroup } from "../enums/StudentGroup";
import { StudentLevel } from "../enums/StudentLevel";
import { IInterview } from "./IInterview";

export interface IStudent extends IUser {
  regNo: string;
  group: StudentGroup;
  level: StudentLevel;
  interviewIds?: string[];
  interviews?: IInterview[];
}
