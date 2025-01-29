"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import DateTime from "./date-time";
import { IQueue } from "@/lib/models/interfaces/IQueue";
import { IInterview } from "@/lib/models/interfaces/IInterview";
import CompanySelector from "./company-selector";
import { FaX } from "react-icons/fa6";
import { ICompany } from "@/lib/models/interfaces/ICompany";
import StallSelector from "./stall-selector";

const Panel = ({
  panelNumber,
  interviews,
  session,
}: {
  panelNumber: number;
  interviews?: IInterview[];
  session: string;
}) => (
  <div className="flex w-full flex-col">
    <div className="bg-slate-100 text-vq-blueGray font-medium w-full flex justify-center py-2">
      {`Queue ${panelNumber}`}
    </div>
    <div
      className={`flex flex-col gap-1 text-sm font-medium py-2 ${
        panelNumber === 1
          ? "pl-2 pr-1"
          : panelNumber === 2
          ? "px-1"
          : "pl-1 pr-2"
      }`}
    >
      {interviews?.map(
        (interview) =>
          interview.session === session && (
            <div
              key={interview.id}
              className={`bg-opacity-70 rounded-sm py-1 flex items-center justify-center ${
                interview.type === "P" ? "bg-vq-success" : "bg-vq-peach"
              }`}
            >
              {interview.studentRegNo}
            </div>
          )
      )}
    </div>
  </div>
);

const Session = ({
  sessionName,
  sessionLabel,
  queues,
}: {
  sessionName: string;
  sessionLabel: string;
  queues: IQueue[];
}) => (
  <div className="grid grid-cols-8 bg-white rounded-md w-full min-h-20 border border-blue-200">
    <div className="bg-blue-200 flex items-center font-medium w-full">
      <span className="w-full p-2">{sessionLabel}</span>
    </div>
    <div className="col-span-7 grid grid-cols-3 w-full">
      {queues.map((queue, index) => (
        <Panel
          key={index}
          panelNumber={index + 1}
          interviews={queue.interviews}
          session={sessionName}
        />
      ))}
    </div>
  </div>
);

const NavigationPanel = ({
  onPrevious,
  onNext,
  currentItem,
}: {
  onPrevious: () => void;
  onNext: () => void;
  currentItem: string;
}) => (
  <div className="w-full bg-vq-pearl flex items-center justify-center gap-2 rounded-md p-2">
    <Button
      onClick={onPrevious}
      className="hover:text-vq-failure bg-transparent text-vq-secondary hover:bg-transparent w-6 h-6"
      size="icon"
    >
      <FaChevronLeft />
    </Button>
    <span className="font-semibold text-lg">{currentItem}</span>
    <Button
      onClick={onNext}
      className="hover:text-vq-failure bg-transparent text-vq-secondary hover:bg-transparent w-6 h-6"
      size="icon"
    >
      <FaChevronRight />
    </Button>
  </div>
);

export default function LiveUpdates() {
  // const [companyList, setCompanyList] = useState<string[]>([]);
  // const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);

  const [company, setCompany] = useState<ICompany | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedStall, setSelectedStall] = useState<string | null>(null);
  const [clearCompanySelection, setClearCompanySelection] = useState(false);
  const [clearStallSelection, setClearStallSelection] = useState(false);
  const [stallList, setStallList] = useState<
    { roomName: string; name: string }[]
  >([]);
  const [queues, setQueues] = useState<IQueue[]>([]);

  // const [currentStallIndex, setCurrentStallIndex] = useState(0);

  useEffect(() => {
    if (selectedCompany && selectedStall) {
      const name = getNameByRoomName(selectedStall);
      if (name) {
        fetchQueuesForCompany(name);
      }
    }
  }, [selectedCompany, selectedStall, setSelectedCompany, setSelectedStall]);

  // useEffect(() => {
  //   if (companyList.length > 0) {
  //     fetchStallsForCompany();
  //   }
  // }, [companyList, currentCompanyIndex]);

  // useEffect(() => {
  //   if (stallList.length > 0) {
  //     fetchQueueByStallName();
  //   }
  // }, [stallList, currentStallIndex]);

  // useEffect(() => {
  //   if (queues.length > 0) {
  //     console.log(queues[0]);
  //   }
  // }, [queues]);

  const getNameByRoomName = (roomName: string) => {
    const stall = stallList.find((s) => s.roomName === roomName);
    return stall ? stall.name : null;
  };

  const getSelectedCompany = (company: string) => {
    setSelectedCompany(company);
  };

  const getSelectedStall = (stall: string) => {
    setSelectedStall(stall);
  };

  const getStalls = ({
    stallList,
  }: {
    stallList: { roomName: string; name: string }[];
  }) => {
    setStallList(stallList);
  };

  const clearSelections = () => {
    setSelectedCompany(null);
    setSelectedCompany(null);
    setClearCompanySelection(true); // Trigger the clearSelection
    setClearStallSelection(true); // Trigger the clearSelection
    setTimeout(() => setClearCompanySelection(false), 0); // Reset the clearSelection to false
    setTimeout(() => setClearStallSelection(false), 0); // Reset the clearSelection to false
  };

  const fetchQueuesForCompany = async (name: string) => {
    try {
      const res = await fetch(
        `api/queues?stallName=${name}&isInterviews=true&all=true`
      );
      const data = await res.json();
      setQueues(data.querySnapshot);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchCompany = async () => {
  //   try {
  //     const res = await fetch("api/companies/names");
  //     const data = await res.json();
  //     setCompanyList(data.querySnapshot);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchStallsForCompany = async () => {
  //   try {
  //     const res = await fetch(
  //       `api/stalls/names?companyName=${companyList[currentCompanyIndex]}`
  //     );
  //     const data = await res.json();
  //     setStallList(data.querySnapshot);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchQueueByStallName = async () => {
  //   try {
  //     const res = await fetch(
  //       `api/queues?stallName=${stallList[currentStallIndex]}&isInterviews=true&all=true`
  //     );
  //     const data = await res.json();
  //     setQueues(data.querySnapshot);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handlePreviousCompany = () => {
  //   setCurrentCompanyIndex((prevIndex) =>
  //     prevIndex === 0 ? companyList.length - 1 : prevIndex - 1
  //   );
  // };

  // const handleNextCompany = () => {
  //   setCurrentCompanyIndex((prevIndex) =>
  //     prevIndex === companyList.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  // const handlePreviousStall = () => {
  //   setCurrentStallIndex((prevIndex) =>
  //     prevIndex === 0 ? stallList.length - 1 : prevIndex - 1
  //   );
  // };

  // const handleNextStall = () => {
  //   setCurrentStallIndex((prevIndex) =>
  //     prevIndex === stallList.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  return (
    <div className="w-full px-5 sm:px-16 pt-8 flex flex-col gap-5 mb-5">
      <h1>Live Updates</h1>

      <DateTime />

      <div className="mb-5 flex flex-col gap-2">
        <div className="flex">
          <CompanySelector
            auto={true}
            getSelectedValue={getSelectedCompany}
            clearSelection={clearCompanySelection}
          />
          <Button
            className="flex font-normal gap-2 bg-stone-800 hover:bg-slate-700"
            onClick={clearSelections}
          >
            Clear <FaX size={12} />
          </Button>
        </div>
        {selectedCompany && (
          <StallSelector
            auto={true}
            getList={getStalls}
            getSelectedValue={getSelectedStall}
            clearSelection={clearStallSelection}
            companyName={selectedCompany}
          />
        )}
      </div>

      {/* <div className="w-full flex gap-5">
        <NavigationPanel
          onPrevious={handlePreviousCompany}
          onNext={handleNextCompany}
          currentItem={companyList[currentCompanyIndex]}
        />
        <NavigationPanel
          onPrevious={handlePreviousStall}
          onNext={handleNextStall}
          currentItem={stallList[currentStallIndex]}
        />
      </div> */}

      <div className="w-full flex items-center font-semibold text-2xl">
        {selectedCompany}
      </div>

      <div className="w-full flex flex-col gap-2 mb-10">
        <Session
          sessionName="M"
          sessionLabel={`Morning Session`}
          queues={queues}
        />

        <div className="w-full flex justify-center items-center bg-blue-200 p-2 rounded-md font-medium">
          Lunch
        </div>

        <Session
          sessionName="A"
          sessionLabel={`Afternoon Session`}
          queues={queues}
        />
      </div>
    </div>
  );
}
