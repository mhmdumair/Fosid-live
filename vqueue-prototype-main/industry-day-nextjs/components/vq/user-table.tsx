"use client";

import React, { useState } from "react";
import UserRecord from "./user-record";
import { IUser } from "@/lib/models/interfaces/IUser";

interface UsersTableProps {
  users: IUser[];
}

function UsersTableHeader() {
  return (
    <div className="hidden sm:grid grid-cols-7 justify-between items-center bg-vq-rose p-2 font-bold">
      <span className="col-span-2">Name</span>
      <span className="col-span-2">Email</span>
      <span className="">Phone</span>
      <span className="">Role</span>
      <span className="text-right">Actions</span>
    </div>
  );
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="w-full rounded overflow-hidden bg-vq-pearl">
      <UsersTableHeader />
      {users.map((user) => (
        <UserRecord key={user.id} user={user} />
      ))}
    </div>
  );
}
