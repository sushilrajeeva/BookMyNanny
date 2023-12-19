import React, { useState, useEffect, useContext } from "react";
import { getActiveJobs } from "../../firebase/NannyFunctions";
import { columns } from "../ListingTable/columns";
import DataTable from "../ListingTable/data-table";
import { AuthContext } from "../../context/AuthContext";
import CustomLoading from "../EssentialComponents/CustomLoading";

const ActiveJobs = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        if (currentUser && userRole === "nanny" && currentUser.uid) {
          const jobs = await getActiveJobs(currentUser.uid);
          setActiveJobs(jobs);
        }
      } catch (error) {
        console.error("Error fetching active jobs:", error);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchActiveJobs();
  }, [currentUser.uid]);

  if (loadingListings) {
    return (
      <div>
        <CustomLoading />
      </div>
    );
  }

  return (
    <div>
      <h2>Active Jobs</h2>
      <DataTable columns={columns} data={activeJobs} />
    </div>
  );
};

export default ActiveJobs;
