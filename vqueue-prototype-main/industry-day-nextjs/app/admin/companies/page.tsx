import React from "react";
import CompaniesList from "@/components/vq/companiesList";

export default async function Page() {
  return (
    <div className="w-full">
        {/* add a suspense and fallback call */}
      <CompaniesList />
    </div>
  );
}
