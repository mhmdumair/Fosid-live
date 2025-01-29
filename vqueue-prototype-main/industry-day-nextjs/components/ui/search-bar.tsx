"use client";

import { useRef } from "react";
import MaxWidthWrapper from "../vq/max-width-wrapper";
import { roomSearch } from "@/lib/config/full-text-search";
import DateTime from "../vq/date-time";

interface Props {
  label?: string;
}

export default function Searchbar({ label }: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInputRef.current?.value || "";
    const results = roomSearch(query);
    console.log("Search Results:", results);
  };

  return (
    <div className="w-full border border-vq-rose bg-vq-pearl p-5 rounded-xl flex flex-col gap-3">
      <div className="font-medium text-sm">
        {label}
      </div>
      <form
        onSubmit={handleSearch}
        className="w-full flex-grow flex items-center"
      >
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="font-medium ml-2 py-2 px-4 bg-vq-secondary hover:bg-vq-failure text-white rounded-md"
        >
          Search
        </button>
      </form>
      <DateTime />
    </div>
  );
}
