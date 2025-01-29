"use client";

import React, { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import { InterviewStatus } from "@/lib/models/enums/InterviewStatus";
import { Room } from "@/lib/models/dto/Room";
import { IInterview } from "@/lib/models/interfaces/IInterview";

export default function RoomForAgent({ roomId }: { roomId: string }) {
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await fetch(`/api/rooms/room?id=${roomId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setRoomDetails(data.room);
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Error fetching room details. Please try again.",
        });
      }
    };

    const fetchRoomInterviews = async () => {
      try {
        const res = await fetch(`/api/rooms/room/stalls`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: roomId, isInterviews: true }),
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setInterviews(data?.interviews || []);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Error fetching interviews. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
    fetchRoomInterviews();
  }, [roomId]);

  const handleAttendanceToggle = async (interview: IInterview) => {
    const newStatus =
      interview.status === InterviewStatus.PRESENT
        ? InterviewStatus.ABSENT
        : InterviewStatus.PRESENT;
  
    // Optimistically update the UI first
    setInterviews((prevInterviews) =>
      prevInterviews.map((int) =>
        int.id === interview.id
          ? { ...int, status: newStatus } // Update to the new status immediately
          : int
      )
    );
  
    try {
      const res = await fetch(`/api/interviews/interview`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewId: interview.id,
          status: newStatus,
        }),
      });
  
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
  
      const updatedInterview = await res.json();
  
      if (!updatedInterview) {
        throw new Error("Interview not found");
      }
  
      // Update the interview status in the local state to match the server's response
      setInterviews((prevInterviews) =>
        prevInterviews.map((int) =>
          int.id === updatedInterview.id
            ? { ...int, status: updatedInterview.status } // Correct status based on server response
            : int
        )
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error updating attendance. Please try again.",
      });
  
      // If there's an error, revert the UI change
      setInterviews((prevInterviews) =>
        prevInterviews.map((int) =>
          int.id === interview.id
            ? { ...int, status: interview.status } // Revert to the original status
            : int
        )
      );
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomDetails) {
    return <div>Room details not available.</div>;
  }

  return (
    <div className="w-full p-16">
      <p className="mb-4 font-semibold text-2xl">{roomDetails.name}</p>
      <h3 className="text-lg font-semibold mb-4">Interviews</h3>
      {interviews.length === 0 ? (
        <p>No interviews available.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="p-2 text-sm flex items-center justify-between border rounded-md shadow-sm"
            >
              <span className="flex-1">{interview.studentRegNo}</span>
              <span className="flex-1">{interview.queueName}</span>
              <span className="flex-1">{interview.stallName}</span>
              <span className="flex-1">
                {new Date(interview.startTime as unknown as string).toLocaleTimeString()}
              </span>
              <Switch
                checked={interview.status === InterviewStatus.PRESENT}
                onCheckedChange={() => handleAttendanceToggle(interview)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
