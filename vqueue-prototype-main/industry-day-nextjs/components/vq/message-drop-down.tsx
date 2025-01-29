// "use client";

import { FaRegEnvelope } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: number;
  message: string;
}

const messages: Message[] = [
  // { id: 1, message: "This is message 1" },
  // { id: 2, message: "This is message 2" },
  // { id: 3, message: "This is message 3" },
  // { id: 4, message: "This is message 4" },
  // { id: 5, message: "This is message 5" },
];

export default function MessageDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-gray-100 rounded-full outline-none">
        <FaRegEnvelope scale={25} className="text-xl max-sm:text-sm hover:text-blue-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {messages.map((m) => (
          <DropdownMenuItem key={m.id}>{m.message}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
