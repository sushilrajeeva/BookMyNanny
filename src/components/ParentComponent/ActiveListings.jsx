import React, { useEffect, useState, useContext } from "react";
import {
  getAllListings,
  getActiveListings,
} from "../../firebase/ParentFunctions";
import DataTable from "../ListingTable/data-table";
import { AuthContext } from "../../context/AuthContext";
import { columns } from "../ListingTable/columns";
import CustomLoading from "../EssentialComponents/CustomLoading";

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
    <div>
      <h2>Active Listings</h2>
      <DataTable columns={columns} data={listings} />
    </div>
  );
}

export default ActiveListings;
