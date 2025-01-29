import React from "react";
export default function AdminRoomsLayout({children, }:{children:React.ReactNode}) {
    return (
      <div>
        <h1>Queues Layout</h1>
        {children}
      </div>
    );
  }