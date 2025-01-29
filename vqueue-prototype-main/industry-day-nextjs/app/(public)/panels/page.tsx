import React, { Suspense } from "react";

import StallLinks from "@/components/vq/stall-links";
import DateTime from "@/components/vq/date-time";

export default function Page() {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-full px-5 sm:px-16 pt-8 flex flex-col gap-5">
        <DateTime />
        <StallLinks />
      </div>
    </main>
  );
}
