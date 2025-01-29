"use client";

import React from "react";
import { IUser } from "@/lib/models/interfaces/IUser";
import TableActions from "./table-actions";

interface UserRecordProps {
  user: IUser;
}

export default function UserRecord({ user }: UserRecordProps) {
  const handleOnView = (id: string) => {
    console.log(`Viewing user with ID: ${id}`);
  };

  const handleOnEdit = (id: string) => {
    console.log(`Editing user with ID: ${id}`);
  };

  const handleOnDelete = (id: string) => {
    console.log(`Deleting user with ID: ${id}`);
  };

  return (
    <>
      {/* web only */}
      <div className="text-sm w-full hidden sm:grid grid-cols-7 justify-between items-center px-2 py-2 border-b border-vq-rose bg-vq-primary hover:bg-vq-white">
        <span className="col-span-2">{user.name}</span>
        <span className="col-span-2">{user.email}</span>
        <span>{user.phone1}</span>
        <span>{user.role}</span>
        <TableActions
          id={user.id}
          onView={handleOnView}
          onEdit={handleOnEdit}
          onDelete={handleOnDelete}
        />
      </div>

      {/* mobile only */}
      <div className="md:hidden text-sm w-full flex flex-col justify-between py-2 border-b border-vq-rose bg-vq-primary hover:bg-vq-white">
        <span className="col-span-2 font-medium text-lg pb-2">{user.name}</span>
        <span className="col-span-2">{user.email}</span>
        <span>{user.phone1}</span>
        <div className="flex justify-between items-center pt-2">
          <span>{user.role}</span>
          <TableActions
            id={user.id}
            onView={handleOnView}
            onEdit={handleOnEdit}
            onDelete={handleOnDelete}
          />
        </div>
      </div>
    </>
  );
}
