"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import DateTime from "./date-time";

export default function RoomMapImage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full px-5 sm:px-16 pb-8 flex flex-col gap-5">
      <Image
        className="w-full rounded-xl drop-shadow-sm border"
        src="/images/venues/Venue Map FOSID 24.png"
        alt="floor Map image"
        width={1200}
        height={1200}
        onLoad={() => setImageLoaded(true)}
      />

      <DateTime />

      <Image
        className="w-full rounded-xl drop-shadow-sm border"
        src="/images/venues/Venue Map FOSID 24 Companies.png"
        alt="floor Map image"
        width={1200}
        height={1200}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
