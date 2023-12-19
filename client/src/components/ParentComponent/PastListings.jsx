import React, { useState, useEffect, useContext } from "react";
import { getPastParentJobs } from "@/firebase/ParentFunctions";
import { Button } from "@/components/ui/button";

// Took reference from shadcn -> https://ui.shadcn.com/docs/components/data-table

// Importing the Listing Table Component
import { columns } from "../ListingTable/columns";
import DataTable from "../ListingTable/data-table";

import { AuthContext } from "../../context/AuthContext";

function PastJobs() {
  const [pastJobs, setPastJobs] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);

  useEffect(() => {
    const fetchPastJobs = async () => {
      try {
        const jobs = await getPastParentJobs(currentUser.uid);
        setPastJobs(jobs);
      } catch (error) {
        console.error("Error fetching Past jobs:", error);
      }
    };

    fetchPastJobs();
  }, [currentUser.uid]); // Dependency array includes nannyID, so this effect runs when nannyID changes

  return (
    <div>
      <h2>Past Jobs</h2>
      <DataTable columns={columns} data={pastJobs} />
    </div>
  );
}

export default PastJobs;
