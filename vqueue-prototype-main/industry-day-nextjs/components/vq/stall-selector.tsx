"use client";

import { useEffect, useState } from "react";
import Dropdown from "./dropdown";

interface Props {
  companyName: string;
  auto?: boolean;
  getSelectedValue?: (value: string) => void;
  getList?: ({
    stallList,
  }: {
    stallList: { roomName: string; name: string }[];
  }) => void;
  getAdditionalValues?: ({ values }: { values: any }) => void;
  clearSelection?: boolean;
}

export default function StallSelector({
  companyName,
  getSelectedValue,
  getList,
  clearSelection,
  auto,
}: Props) {
  const [stallList, setStallList] = useState<
    { roomName: string; name: string }[]
  >([]);
  const [currentStallIndex, setCurrentStallIndex] = useState(0);

  useEffect(() => {
    fetchStalls();
  }, [companyName]);

  useEffect(() => {
    if (stallList.length > 0 && getList) {
      getList({ stallList });
    }
  }, [stallList, setStallList]);

  const fetchStalls = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stalls/names?companyName=${companyName}`
      );
      const data = await res.json();
      setStallList(data.querySnapshot);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <Dropdown
        items={stallList.map((stall) => stall.roomName)}
        placeholder="Company"
        getSelectedItem={getSelectedValue}
        clearSelection={clearSelection}
        auto={auto}
      />
    </div>
  );
}
