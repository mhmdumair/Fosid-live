"use client";

import React from "react";
import TableActions from "./table-actions";
import { IQueue } from "@/lib/models/interfaces/IQueue";

interface QueueRecordProps {
  queue: IQueue;
}

export default function QueueRecord({ queue }: QueueRecordProps) {
  const handleOnView = (id: string) => {
    console.log(`Viewing queue with ID: ${id}`);
  };

  const handleOnEdit = (id: string) => {
    console.log(`Editing queue with ID: ${id}`);
  };

  const handleOnDelete = (id: string) => {
    console.log(`Deleting queue with ID: ${id}`);
  };

  return (
    <div className="text-sm w-full grid grid-cols-7 justify-between items-center px-2 py-1 border-b border-vq-rose bg-vq-primary hover:bg-vq-white">
      <span className="col-span-2">{queue.name}</span>
      <span className="col-span-2">{queue.stallName}</span>
      <span className="col-span-2">{queue.queueStatus}</span>
      <TableActions
        id={queue.id}
        onView={handleOnView}
        onEdit={handleOnEdit}
        onDelete={handleOnDelete}
      />
    </div>
  );
}
