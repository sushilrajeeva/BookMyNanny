import React, { useState, useEffect, useContext } from "react";
import { getActiveJobs } from "../../firebase/NannyFunctions";
import { columns } from "../ListingTable/columns";
import DataTable from "../ListingTable/data-table";
import { AuthContext } from "../../context/AuthContext";
import CustomLoading from "../EssentialComponents/CustomLoading";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    <>
      {activeJobs.length === 0 ? (
        <>
          <DataTable columns={columns} data={activeJobs} />
          <div className="flex flex-wrap justify-center gap-4 w-full px-4">
            <Alert className="w-1/4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                <p>No Active Jobs found!</p>
              </AlertDescription>
            </Alert>
          </div>
        </>
      ) : (
        <>
          <h2>Active Jobs</h2>
          <DataTable columns={columns} data={activeJobs} />
        </>
      )}
    </>
  );
};

export default ActiveJobs;
