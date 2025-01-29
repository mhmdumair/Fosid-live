"use client";

import React from "react";
import CompanyRecord from "./company-record";
import { ICompany } from "@/lib/models/interfaces/ICompany";

interface CompaniesTableProps {
  companies: ICompany[];
}

function CompaniesTableHeader() {
  return (
    <div className="grid grid-cols-7 justify-between items-center bg-vq-rose p-2 font-bold">
      <span className="col-span-2">Company Name</span>
      <span className="col-span-2">Company Email</span>
      <span className="">Phone</span>
      <span className="">Status</span>
      <span className="text-right">Actions</span>
    </div>
  );
}

export default function CompaniesTable({ companies }: CompaniesTableProps) {
  return (
    <div className="w-full rounded overflow-hidden bg-vq-pearl">
      <CompaniesTableHeader />
      {companies.map((company) => (
        <CompanyRecord key={company.id} company={company} />
      ))}
    </div>
  );
}
