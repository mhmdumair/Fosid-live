"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Role } from "@/lib/models/enums/Role";
import { UserUnion } from "@/lib/models/unions/user.union";
import { DirectionType } from "@/lib/models/params/params";
import { GetUsersParams } from "@/lib/models/params/user.params";
import UsersTable from "./user-table";
import UserRecord from "./user-record";

// use table actions component
// dont use table component from shadcn ui
// create user record compoennt
// use proper callback function in table actions

interface Props {
  role?: Role;
}

export function UserDetails({ user }: { user: UserUnion }) {
  return <UserRecord user={user} />;
}

export default function UsersList({ role }: Props) {
  const [users, setUsers] = useState<UserUnion[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<DirectionType>("next");

  const buildQueryParams = ({
    role,
    pageSize,
    last,
    first,
    direction,
  }: GetUsersParams): string => {
    const params = new URLSearchParams();

    if (role) {
      params.append("role", role);
    }

    if (pageSize !== undefined) {
      params.append("limit", pageSize.toString());
    }

    if (direction !== undefined) {
      params.append("direction", direction);
    }

    if (direction === "prev" && first) {
      params.append("first", first);
    }

    if (direction === "next" && last) {
      params.append("last", last);
    }

    return params.toString();
  };

  const fetchUsers = async ({
    role = undefined,
    pageSize = 10,
    last = undefined,
  }: GetUsersParams) => {
    /**
     * To get all users with no limit: getUsers({})
     * To get all users with a limit of only 10 uers at a time: getUsers({ pageSize: 10 })
     */

    try {
      const res = await fetch(
        `/api/users/?${buildQueryParams({
          role,
          pageSize,
          first,
          last,
          direction,
        })}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const fetchedUsers = await res.json();
      const count = fetchedUsers.querySnapshot.length;

      setUsers(fetchedUsers.querySnapshot);
      setFirst(fetchedUsers.querySnapshot[0]?.uid);
      setLast(fetchedUsers.querySnapshot[count - 1]?.uid);

      // toast({
      //   title: "Users Fetch Successful",
      // });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching users. ${error}`,
      });
    }
  };

  const prevPage = () => {
    setDirection("prev");
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setDirection("next");
    setPage((prevPage) => Math.min(prevPage + 1, pageCount));
  };

  useEffect(() => {
    const fetchUsersCount = async () => {
      const res = await fetch("/api/users/count", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPageCount(Math.ceil(data.count / pageSize));
      } else {
        toast({
          title: "Error fetching users",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    };

    fetchUsersCount();
    fetchUsers({ role, pageSize, direction });
  }, []);

  useEffect(() => {
    if (direction === "next") {
      fetchUsers({ role, pageSize, last, direction });
    } else if (direction === "prev") {
      fetchUsers({ role, pageSize, first, direction });
    }
  }, [page, direction]);

  return (
    <div className="w-full flex flex-col items-center gap-5 p-10">
      <div className="w-full text-lg font-medium bg-vq-rose sm:bg-transparent px-2 sm:px-0 rounded-t-md py-2 sm:py-0">Users</div>
      <div className="flex flex-col w-full">
        <UsersTable users={users} />
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="font-medium text-sm">Users per page: {pageSize}</span>
        <span className="font-bold">
          Page {page} of {pageCount}
        </span>
        <div className="flex gap-1">
          <Button
            onClick={prevPage}
            disabled={page === 1}
            size="sm"
            className="rounded-sm"
          >
            Prev
          </Button>
          <Button
            onClick={nextPage}
            disabled={page === pageCount}
            size="sm"
            className="rounded-sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
