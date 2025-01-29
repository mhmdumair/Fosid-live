// "use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { userAvatarItems } from "@/lib/config/navbarConfig";

export default function UserAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none">
        <Tooltip>
          <TooltipTrigger asChild className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Profile</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="hover:text-vq-failure">
          <Link href="/profile">Profile</Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userAvatarItems.items.map((m) => (
          <DropdownMenuItem className="hover:text-vq-failure" key={m.label}>
            <Link href={m.href ?? "#"}>{m.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
