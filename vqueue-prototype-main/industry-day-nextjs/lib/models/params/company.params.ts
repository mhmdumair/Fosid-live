import { CompanyStatus } from "../enums/CompanyStatus";
import { PaginatedParams } from "./params";

export type CreateCompanyInput = {
  name: string;
  code?: string;
  email: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  status: CompanyStatus;
};

export type UpdateCompanyInput = {
  id: string;
  companyId: string;
  code?: string;
  name?: string;
  email?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  stallINames?: string[];
  status?: CompanyStatus;
};

export interface GetCompaniesParams extends PaginatedParams {
  isStalls?: boolean;
  all?: boolean;
  namesOnly?: boolean;
  name?: string;
  code?: string;
}

export interface GetCompanyParams {
  companyId: string;
  code?: string;
}

export interface GetCompanyByNameParams {
  name: string;
  isStalls?: boolean;
  code?: string;
}
