// TODO: get rooms from firebase

"use client";

import { IRoom } from "@/lib/models/interfaces/IRoom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { DirectionType } from "@/lib/models/params/params";
import { toast } from "../ui/use-toast";
import { GetRoomsParams } from "@/lib/models/params/room.params";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Indicator from "./indicator";
import StallsOfRoom from "./stalls-of-room";
import Dropdown from "./dropdown";

interface RoomMapLinkProps {
  id: string;
  name: string;
  departmentName?: string;
}

interface RoomMapLinkFooterProps {
  id: string;
  name: string;
  departmentName?: string;
}

function RoomMapLinkFooter({
  id,
  name,
  departmentName,
}: RoomMapLinkFooterProps) {
  return (
    <Dialog>
      <DialogTrigger className="font-medium w-full border-vq-gold bg-blue-300 rounded-b-md py-2 text-[12px] group-hover:bg-blue-500 inline-flex justify-center items-center text-vq-secondary group-hover:text-vq-white">
        <FaArrowRight className="-rotate-45 mr-2" />
        View
      </DialogTrigger>
      <DialogContent className="w-80 sm:w-full rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{name}</DialogTitle>
          <DialogDescription className="text-vq-secondary font-medium">
            {departmentName}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col sm:flex-row justify-between gap-2">
          <Indicator label="Open" type="success" />
          <Indicator label="On Break" type="peach" />
          <Indicator label="Closed" type="failure" />
        </div>
        <StallsOfRoom roomId={id} />
      </DialogContent>
    </Dialog>
  );
}

function RoomMapLink({ id, name, departmentName }: RoomMapLinkProps) {
  return (
    <Card
      key={name}
      className="shadow-sm group hover:border-stone-300 bg-white flex flex-col justify-between"
    >
      <CardHeader className="pb-0">
        {/* <CardDescription className="text-vq-secondary">Room</CardDescription> */}
        <CardTitle className="text-gray-700 text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-sm text-vq-stale ">Department of {departmentName}</p>
      </CardContent>
      <CardFooter className="p-0 bg-vq-pearl rounded-b-md">
        <RoomMapLinkFooter
          id={id}
          name={name}
          departmentName={departmentName}
        />
      </CardFooter>
    </Card>
  );
}

export default function RoomMapLinks() {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<DirectionType>("next");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomsCount = async () => {
      const res = await fetch("/api/rooms/count", {
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
          title: "Error fetching rooms",
          description: "Failed to fetch rooms",
          variant: "destructive",
        });
      }
    };

    fetchRoomsCount();
    fetchRooms({ pageSize, direction });
  }, []);

  useEffect(() => {
    if (direction === "next") {
      fetchRooms({ pageSize, last, direction });
    } else if (direction === "prev") {
      fetchRooms({ pageSize, first, direction });
    }
  }, [page, direction]);

  const buildQueryParams = ({
    pageSize,
    last,
    first,
    direction,
  }: GetRoomsParams): string => {
    const params = new URLSearchParams();

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

  const fetchRooms = async ({
    pageSize = 10,
    last = undefined,
  }: GetRoomsParams) => {
    /**
     * To get all rooms with no limit: getRooms({})
     * To get all rooms with a limit of only 10 uers at a time: getRooms({ pageSize: 10 })
     */

    try {
      setIsLoading(true); // Start loading
      const res = await fetch(
        `/api/rooms/?${buildQueryParams({
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
      const fetchedRooms = await res.json();
      const count = fetchedRooms.querySnapshot.length;

      setRooms(fetchedRooms.querySnapshot);
      setFirst(fetchedRooms.querySnapshot[0]?.roomId);
      setLast(fetchedRooms.querySnapshot[count - 1]?.roomId);
      setIsLoading(false); // End loading

      // toast({
      //   title: "Users Fetch Successful",
      // });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching rooms. ${error}`,
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

  return (
    <div className="w-full">
      <ul className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="bg-slate-200 h-40 w-full rounded-md"
              />
            ))
          : rooms?.map((room) => (
              <RoomMapLink
                key={room.id}
                id={room.id}
                name={room.name}
                departmentName={room.department}
              />
            ))}
      </ul>
      <div className="flex justify-between items-center w-full mt-5 p-4 border border-slate-300 rounded-lg">
        <span className="font-medium text-sm">Rooms per page: {pageSize}</span>
        <span className="font-bold">
          Page {page} of {pageCount}
        </span>
        <div className="flex gap-1">
          <Button
            onClick={prevPage}
            disabled={page === 1}
            size="sm"
            className="rounded-sm hover:bg-slate-700 "
          >
            Prev
          </Button>
          <Button
            onClick={nextPage}
            disabled={page === pageCount}
            size="sm"
            className="rounded-sm hover:bg-slate-700 "
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
