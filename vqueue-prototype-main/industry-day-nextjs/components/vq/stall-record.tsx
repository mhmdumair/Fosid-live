"use client";

import React from "react";
import TableActions from "./table-actions";
import { IStall } from "@/lib/models/interfaces/IStall";

interface StallRecordProps {
  stall: IStall;
}

export default function StallRecord({ stall }: StallRecordProps) {
  const handleOnView = (id: string) => {
    console.log(`Viewing stall with ID: ${id}`);
  };

  const handleOnEdit = (id: string) => {
    console.log(`Editing stall with ID: ${id}`);
  };

  const handleOnDelete = (id: string) => {
    console.log(`Deleting stall with ID: ${id}`);
  };

  return (
    <div className="text-sm w-full grid grid-cols-8 justify-between items-center px-2 py-1 border-b border-vq-rose bg-vq-primary hover:bg-vq-white">
      <span className="col-span-2">{stall.name}</span>
      <span className="col-span-2">{stall.companyName}</span>
      <span className="col-span-2">{stall.stallStatus}</span>
      <TableActions
        id={stall.id}
        onView={handleOnView}
        onEdit={handleOnEdit}
        onDelete={handleOnDelete}
      />
    </div>
  );
}
