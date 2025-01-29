// import CurrentUserWrapper from "@/components/vq/current-user-wrapper";
import UserProfileCard from "@/components/vq/user-profile-card";
import React from "react";

export default function Page() {
  return (
    <main className="w-full flex flex-col items-center min-h-screen">
      {/* <CurrentUserWrapper> */}
        <UserProfileCard />
      {/* </CurrentUserWrapper> */}
    </main>
  );
}
