"use client";

import React from "react";
import StallRecord from "./stall-record";
import { IStall } from "@/lib/models/interfaces/IStall";

interface StallsTableProps {
  stalls: IStall[];
}

function StallsTableHeader() {
  return (
    <div className="grid grid-cols-8 justify-between items-center bg-vq-rose p-2 font-bold">
      <span className="col-span-2">Stall Name</span>
      <span className="col-span-2">Company</span>
      <span className="col-span-2">Stall Status</span>
      <span className="text-right col-span-2">Actions</span>
    </div>
  );
}

export default function StallsTable({ stalls }: StallsTableProps) {
  return (
    <div className="w-full rounded overflow-hidden bg-vq-pearl">
      <StallsTableHeader />
      {stalls.map((stall) => (
        <StallRecord key={stall.id} stall={stall} />
      ))}
    </div>
  );
}
