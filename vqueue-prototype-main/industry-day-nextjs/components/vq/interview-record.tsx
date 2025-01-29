"use client";

import React from "react";
import TableActions from "./table-actions";
import { IInterview } from "@/lib/models/interfaces/IInterview";

interface InterviewRecordProps {
  interview: IInterview;
}

export default function InterviewRecord({ interview }: InterviewRecordProps) {
  const handleOnView = (id: string) => {
    console.log(`Viewing interview with ID: ${id}`);
  };

  const handleOnEdit = (id: string) => {
    console.log(`Editing interview with ID: ${id}`);
  };

  const handleOnDelete = (id: string) => {
    console.log(`Deleting interview with ID: ${id}`);
  };

  return (
    <div className="text-sm w-full grid grid-cols-9 justify-between items-center px-2 py-1 border-b border-vq-rose bg-vq-primary hover:bg-vq-white">
      <span className="col-span-2">{interview.studentRegNo}</span>
      <span className="col-span-2">{interview.companyName}</span>
      <span className="col-span-2">{interview.stallName}</span>
      <span className="col-span-1">{interview.status}</span>
      <span className="col-span-1">{interview.type}</span>
      <TableActions
        id={interview.id}
        onView={handleOnView}
        onEdit={handleOnEdit}
        onDelete={handleOnDelete}
      />
    </div>
  );
}
