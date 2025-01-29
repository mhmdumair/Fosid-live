import React, { Suspense } from "react";

// import RoomMapLinks from "@/components/vq/room-map-links";
import RoomMapImage from "@/components/vq/room-map-image";

export default function Page() {
  return (
    <main className="w-full flex flex-col items-center">

      <div className="w-full bg-vq-white flex justify-center">
        <RoomMapImage />
      </div>

      {/* <div className="w-full px-5 sm:px-16 pt-8 flex flex-col gap-5">
        <RoomMapLinks />
      </div> */}
    </main>
  );
}
