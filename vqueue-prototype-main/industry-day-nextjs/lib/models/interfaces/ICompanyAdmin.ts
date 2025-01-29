import { IUser } from "./IUser";
import { ICompany } from "./ICompany";

export interface ICompanyAdmin extends IUser {
  companyName: string;
  company?: ICompany;
}
