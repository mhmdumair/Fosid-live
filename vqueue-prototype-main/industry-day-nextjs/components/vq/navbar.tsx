// "use client";

import { publicNavbarItems } from "@/lib/config/navbarConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaBars } from "react-icons/fa";

interface SubMenuItem {
  label: string;
  href?: string;
}

interface MenuItemProps {
  label: string;
  href?: string;
  subitems?: SubMenuItem[];
}

function MenuItem({ label, href, subitems }: MenuItemProps) {
  return (
    <div className="w-full md:w-36">
      {!subitems ? (
        <DropdownMenu>
          <Link href={href ?? "#"}>
            <DropdownMenuTrigger className="bg-white rounded-full w-full py-1 flex justify-start pl-4 md:pl-0 md:justify-center font-medium hover:text-blue-500 border-0 outline-0">
              {label}
            </DropdownMenuTrigger>
          </Link>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full py-1 rounded-sm font-medium hover:text-blue-500 border-0 outline-none">
            <div className="flex justify-start pl-4 md:pl-0 md:justify-center items-center gap-1">
              {label}
              <ChevronDown className="pt-1" size={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-vq-white shadow-none">
            {subitems.map((subitem) => (
              <Link key={subitem.label} href={subitem.href ?? "#"}>
                <DropdownMenuItem key={subitem.label}>
                  {subitem.label}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

function MobileMenuItem({ label, href, subitems }: MenuItemProps) {
  return (
    <div className="w-full md:w-36 md:bg-transparent">
      {!subitems ? (
        <Link
          href={href ?? "#"}
          className="w-full py-2 flex justify-start md:pl-0 md:justify-center font-medium border-0 outline-0"
        >
          {label}
        </Link>
      ) : (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className=" py-2">{label}</AccordionTrigger>
            <AccordionContent>
              {subitems.map((subitem) => (
                <Link
                  key={subitem.label}
                  href={subitem.href ?? "#"}
                  className="w-full py-2 flex justify-start md:pl-0 md:justify-center border-0 outline-0"
                >
                  {subitem.label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full hidden sm:flex gap-2 justify-center max-w-screen-sm">
        {publicNavbarItems.items.map((item) => (
          <MenuItem
            key={item.label}
            label={item.label}
            href={item.href}
            subitems={item.subitems}
          />
        ))}
      </div>

      <div className="w-full flex justify-between items-center px-5 py-2 md:hidden">
        <div className="w-full text-xl font-bold">ID24</div>
        <Sheet>
          <SheetTrigger>
            <FaBars size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="bg-vq-pearl">
            <SheetHeader>
              <SheetTitle>INDUSTRY DAY 2024</SheetTitle>
            </SheetHeader>
            <div className="mt-5 w-full sm:hidden flex flex-col justify-center max-w-screen-sm">
              {publicNavbarItems.items.map((item) => (
                <MobileMenuItem
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  subitems={item.subitems}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
