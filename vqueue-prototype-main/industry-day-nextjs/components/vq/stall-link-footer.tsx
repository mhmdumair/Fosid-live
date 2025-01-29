import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Indicator from "./indicator";
import { FaArrowRight } from "react-icons/fa";
import QueuesOfStall from "./queues-of-stall";
import { UserUnion } from "@/lib/models/unions/user.union";
import { IStall } from "@/lib/models/interfaces/IStall";

interface StallLinkFooterProps {
  stall: IStall;
  user?: UserUnion;
  name: string;
  roomName?: string;
  companyName?: string;
}

export default function StallLinkFooter({
  stall,
  user,
  name,
  roomName,
  companyName,
}: StallLinkFooterProps) {
  return (
    <Dialog>
      <DialogTrigger className="font-medium w-full bg-blue-300 rounded-b-md py-2 text-[12px] group-hover:bg-blue-500 inline-flex justify-center items-center text-vq-secondary group-hover:text-vq-white">
        <FaArrowRight className="-rotate-45 mr-2" />
        View
      </DialogTrigger>
      <DialogContent className="w-80 sm:w-full rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{companyName}</DialogTitle>
          <DialogDescription className="text-vq-secondary font-medium flex flex-col gap-1">
            <span className="text-vq-stale">{roomName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col sm:flex-row justify-between gap-2">
          <Indicator label="Empty" type="success" />
          <Indicator label="Available" type="peach" />
          <Indicator label="Overloaded" type="failure" />
        </div>
        <QueuesOfStall user={user} stall={stall} />
      </DialogContent>
    </Dialog>
  );
}
