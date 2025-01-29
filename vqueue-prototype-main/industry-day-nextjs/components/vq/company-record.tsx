"use client";

import React from "react";
import { ICompany } from "@/lib/models/interfaces/ICompany";
import TableActions from "./table-actions";

interface CompanyRecordProps {
  company: ICompany;
}

export default function CompanyRecord({ company }: CompanyRecordProps) {
  const handleOnView = (id: string) => {
    console.log(`Viewing company with ID: ${id}`);
  };

  const handleOnEdit = (id: string) => {
    console.log(`Editing company with ID: ${id}`);
  };

  const handleOnDelete = (id: string) => {
    console.log(`Deleting company with ID: ${id}`);
  };

  return (
    <div className="text-sm w-full grid grid-cols-7 justify-between items-center px-2 py-1 border-b border-vq-rose bg-vq-primary hover:bg-vq-white">
      <span className="col-span-2">{company.name}</span>
      <span className="col-span-2">{company.email}</span>
      <span>{company.phone1 || company.phone2}</span>
      <span>{company.status}</span>
      <TableActions
        id={company.id}
        onView={handleOnView}
        onEdit={handleOnEdit}
        onDelete={handleOnDelete}
      />
    </div>
  );
}
