


import React, { useEffect, useState, useContext } from 'react';
import { getAllListings } from '../firebase/ParentFunctions';
import DataTable from '../components/ListingTable/data-table';
import { AuthContext } from "../context/AuthContext";



function MyListing() {
  const [listings, setListings] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    // Fetch all listings when the component mounts
    const fetchListings = async () => {
      try {
        // Check if there is a logged-in user with the parent role
        if (currentUser && userRole === 'parent' && currentUser.uid        ) {
          const parentListings = await getAllListings(currentUser.uid);
          setListings(parentListings);
          console.log(parentListings);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchListings();
  }, []);

  const columns = [
    {
      accessorKey: 'listingName',
      header: 'Listing Name',
    },
    {
      accessorKey: 'postedDate',
      header: 'Posted Date',
    },
    {
      accessorKey: 'jobStartDate',
      header: 'Start Date',
    },
    {
      accessorKey: 'jobEndDate',
      header: 'End Date',
    },
  ];

  if (loadingListings) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>All Listings</h1>
      <DataTable columns={columns} data={listings} />
    </div>
  );
}

export default MyListing;
