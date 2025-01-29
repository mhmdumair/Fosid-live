import React from "react";
import StallsList from "@/components/vq/stallsList";

export default async function Page() {
  return (
    <div className="w-full">
        {/* add a suspense and fallback call */}
      <StallsList />
    </div>
  );
}
