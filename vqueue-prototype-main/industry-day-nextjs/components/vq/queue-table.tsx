"use client";

import React from "react";
import QueueRecord from "./queue-record";
import { IQueue } from "@/lib/models/interfaces/IQueue";

interface QueuesTableProps {
  queues: IQueue[];
}

function QueuesTableHeader() {
  return (
    <div className="grid grid-cols-7 justify-between items-center bg-vq-rose p-2 font-bold">
      <span className="col-span-2">Name</span>
      <span className="col-span-2">Stall</span>
      <span className="col-span-2">Status</span>
      <span className="text-right col-span-1">Actions</span>
    </div>
  );
}

export default function QueuesTable({ queues }: QueuesTableProps) {
  return (
    <div className="w-full rounded overflow-hidden bg-vq-pearl">
      <QueuesTableHeader />
      {queues.map((queue) => (
        <QueueRecord key={queue.id} queue={queue} />
      ))}
    </div>
  );
}
