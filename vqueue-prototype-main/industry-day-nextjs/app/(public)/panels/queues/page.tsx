import React from "react";

import Searchbar from "@/components/ui/search-bar";
import QueueLinks from "@/components/vq/queue-links";

export default function Page() {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-full px-5 sm:px-16 pt-8 flex flex-col gap-5">
        <Searchbar
          label={`Search Queues by\n
Stall Name or Company Name`}
        />
        <QueueLinks />
      </div>
    </main>
  );
}
