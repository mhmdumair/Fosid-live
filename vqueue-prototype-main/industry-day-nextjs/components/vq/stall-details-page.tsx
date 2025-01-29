"use client";
import React, { useState } from "react";
// import Navbar from "@/components/vq/navbar";
// import Searchbar from "../ui/search-bar";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";

interface StallDetailsPageProps {
  pageTitle?: string;
  stallName?: string;
  companyName?: string;
  numberOfQueues?: string;
}

const StallDetailsPage: React.FC<StallDetailsPageProps> = (
  {
    // pageTitle = "Stall Details",
    // stallName = "Stall Name",
    // companyName = "Company",
    // numberOfQueues = "3",
  }
) => {
  // const [selectedQueue, setSelectedQueue] = useState("Queue 1");
  // const queues: Record<string, string[]> = {
  //   "Queue 1": ["Candidate 1", "Candidate 2"],
  //   "Queue 2": ["Candidate 3", "Candidate 4"],
  //   "Queue 3": ["Candidate 5", "Candidate 6"],
  // };

  // const handleSearch = (query: string) => {
  //   console.log("Search:", query);
  // };

  // const handleQueueChange = (value: string) => {
  //   setSelectedQueue(value);
  // };

  return (
    <div>
      {/* <Navbar />
      <Searchbar onSearch={handleSearch} label="Search Stalls" />
      <div style={styles.stallDetails}>
        <h1 style={{ ...styles.boldText, fontSize: "32px" }}>{pageTitle}</h1>

        <div style={styles.detailsRow}>
          <div style={styles.column}>
            <p style={styles.boldText}>{stallName}</p>
            <h2>CodeGen Stall</h2>
          </div>
          <div style={styles.column}>
            <p style={styles.boldText}>{companyName}</p>
            <h2>CodeGen (Pvt) Ltd.</h2>
          </div>
          <div style={styles.column}>
            <h2 style={styles.boldText}>Number Of Queues</h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 border border-gray-300 rounded-md bg-white">
                {selectedQueue}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Queue</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(queues).map((queue, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleQueueChange(queue)}
                  >
                    {queue}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div style={styles.candidateSection}>
          <h2 style={styles.boldText}>
            Current Interview Candidates in {selectedQueue}
          </h2>
          <ul>
            {queues[selectedQueue].map((candidate, index) => (
              <li key={index}>{candidate}</li>
            ))}
          </ul>
        </div>
      </div> */}
    </div>
  );
};

// const styles = {
//   pageContainer: {
//     fontFamily: "Arial, sans-serif",
//     padding: "20px",
//   },
//   stallDetails: {
//     padding: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     backgroundColor: "#fff",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     marginTop: "20px",
//     textAlign: "center",
//   },
//   detailsRow: {
//     display: "flex",
//     flexDirection: "row",
//     gap: "20px",
//     justifyContent: "center",
//     marginTop: "20px",
//   },
//   column: {
//     flex: "1",
//   },
//   boldText: {
//     fontWeight: "bold",
//   },
//   candidateSection: {
//     marginTop: "20px",
//     textAlign: "left",
//   },
// };

export default StallDetailsPage;
