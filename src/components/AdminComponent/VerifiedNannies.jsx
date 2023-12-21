import React, { useEffect, useState } from "react";
import { getVerifiedNannies } from "../../firebase/AdminFunctions";
import DataTable from "../ListingTable/data-table";

function verifiedNannies() {
  const [nannies, setNannies] = useState([]);

  useEffect(() => {
    // Fetch all nannies when the component mounts
    const fetchNannies = async () => {
      try {
        const verifiedNannies = await getVerifiedNannies();
        setNannies(verifiedNannies);
      } catch (error) {
        console.error("Error fetching Nannies:", error);
      }
    };

    fetchNannies();
  }, []);

  // Define the columns for the DataTable
  const columns = [
    {
      accessorKey: "firstName",
      header: "Name",
    },
    {
      accessorKey: "ssn",
      header: "SSN",
    },
  ];

  return (
    <div>
      <h1>Verified Nannies</h1>
      <DataTable columns={columns} data={nannies} />
    </div>
  );
}

export default verifiedNannies;
