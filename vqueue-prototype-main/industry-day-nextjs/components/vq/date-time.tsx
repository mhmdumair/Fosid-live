"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarDays } from "@fortawesome/free-solid-svg-icons";

const DateTime: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDateParts = new Intl.DateTimeFormat(
    undefined,
    options
  ).formatToParts(date);
  const formattedDate = formattedDateParts
    .map(({ type, value }) => {
      if (type === "day") {
        const day = parseInt(value);
        let suffix = "th";
        if (day % 10 === 1 && day !== 11) {
          suffix = "st";
        } else if (day % 10 === 2 && day !== 12) {
          suffix = "nd";
        } else if (day % 10 === 3 && day !== 13) {
          suffix = "rd";
        }
        return `${value}${suffix}`;
      }
      return value;
    })
    .join(" ");

  return (
    <div className="py-2 px-4 flex font-medium justify-between items-center bg-slate-300 rounded-lg">
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faClock} className="text-stone-900" />
        <span className="text-stone-900">
          {formattedHours}:{formattedMinutes} {ampm}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faCalendarDays} className="text-stone-900" />
        <span className="text-stone-900">{formattedDate}</span>
      </div>
    </div>
  );
};

export default DateTime;
