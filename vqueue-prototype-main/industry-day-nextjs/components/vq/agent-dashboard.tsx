"use client";

import React, { useEffect } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function AgentDashboard() {
  const router = useRouter();

  useEffect(() => {
    redirectToRoom();
  }, []);

  const verifyUserExists = async (email: string) => {
    const res = await fetch("/api/users/user/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const { user } = await res.json();
    return user;
  };

  const fetchRoomByRoomName = async (roomName: string) => {
    const res = await fetch("/api/rooms/room/name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: roomName }),
    });
    const { room } = await res.json();
    return room;
  };

  const redirectToRoom = async () => {
    const accessToken = getCookie("accessToken");
    const currentUser = getCookie("currentUser");

    if (accessToken && currentUser) {
      // Check if user is a roomAdmin
      const verifiedUser = await verifyUserExists(
        JSON.parse(currentUser).email
      );
      if (verifiedUser.role === "roomAdmin") {
        const roomDetails = await fetchRoomByRoomName(verifiedUser.roomName);
        if (roomDetails) {
          router.push(`/agent/room/${roomDetails.roomId}`);
        } else {
          router.push("/panels");
        }
      } else {
        router.push("/panels");
      }
    }
  };

  return <></>;
}
