"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

interface Props {
  inputDate?: string;
}

export default function Time({ inputDate }: Props) {
  const [date, setDate] = useState<Date>(
    inputDate ? new Date(inputDate) : new Date()
  );

  useEffect(() => {
    if (inputDate) {
      setDate(new Date(inputDate));
    }
  }, [inputDate]);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);

  return (
    <div className="flex items-center space-x-2 text-vq-stale">
      <FontAwesomeIcon icon={faClock} size="sm" />
      <span className="text-sm font-medium">{formattedTime}</span>
    </div>
  );
}
