import React, { useEffect, useState, useContext } from "react";
import {
  getAllListings,
  getActiveListings,
} from "../../firebase/ParentFunctions";
import DataTable from "../ListingTable/data-table";
import { AuthContext } from "../../context/AuthContext";
import { columns } from "../ListingTable/columns";
import CustomLoading from "../EssentialComponents/CustomLoading";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ActiveListings() {
  const [listings, setListings] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Check if there is a logged-in user with the parent role
        if (currentUser && userRole === "parent" && currentUser.uid) {
          const parentListings = await getActiveListings(currentUser.uid);
          setListings(parentListings);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchListings();
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
      {listings.length === 0 ? (
        <>
          <DataTable columns={columns} data={listings} />
          <div className="flex flex-wrap justify-center gap-4 w-full px-4">
            <Alert className="w-1/4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                <p>No Active Listings found!</p>
              </AlertDescription>
            </Alert>
          </div>
        </>
      ) : (
        <>
          <h2>Active Listings</h2>
          <DataTable columns={columns} data={listings} />
        </>
      )}
    </>
  );
}

export default ActiveListings;
