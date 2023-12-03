import React, { useState, useEffect, useContext } from 'react';
import { getPastJobs } from "../../firebase/NannyFunctions";
import { Button } from "@/components/ui/button"

// Took reference from shadcn -> https://ui.shadcn.com/docs/components/data-table
 
// Importing the Listing Table Component 
import { columns } from "../ListingTable/columns"
import DataTable from "../ListingTable/data-table"

import { AuthContext } from "../../context/AuthContext";

function PastJobs() {

  const [pastJobs, setPastJobs] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);


//   // some css 
//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
// };

// const thTdStyle = {
//     border: '1px solid black',
//     padding: '8px',
//     textAlign: 'left',
// };

useEffect(() => {
    const fetchPastJobs = async () => {
        try {
            const jobs = await getPastJobs(currentUser.uid);
            setPastJobs(jobs);
        } catch (error) {
            console.error('Error fetching Past jobs:', error);
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

export default PastJobs