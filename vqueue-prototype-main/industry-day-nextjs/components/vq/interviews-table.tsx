"use client";

import React from "react";
import InterviewRecord from "./interview-record";
import { IInterview } from "@/lib/models/interfaces/IInterview";

interface InterviewsTableProps {
  interviews: IInterview[];
}

function InterviewsTableHeader() {
  return (
    <div className="grid grid-cols-9 justify-between items-center bg-vq-rose p-2 font-bold">
      <span className="col-span-2">Student Reg No</span>
      <span className="col-span-2">Company</span>
      <span className="col-span-2">Stall</span>
      <span className="col-span-1">Status</span>
      <span className="col-span-1">Interview Type</span>
      <span className="text-right col-span-1">Actions</span>
    </div>
  );
}

export default function InterviewsTable({ interviews }: InterviewsTableProps) {
  return (
    <div className="w-full rounded overflow-hidden bg-vq-pearl">
      <InterviewsTableHeader />
      {interviews.map((interview) => (
        <InterviewRecord key={interview.id} interview={interview} />
      ))}
    </div>
  );
}
