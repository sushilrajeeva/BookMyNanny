


import React, { useEffect, useState } from 'react';
import { getAllListings } from '../firebase/ParentFunctions';
import DataTable from '../components/ListingTable/data-table';


function MyListing() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch all listings when the component mounts
    const fetchListings = async () => {
      try {
        const allListings = await getAllListings();
        setListings(allListings);
        console.log(allListings)
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Handle the error appropriately (e.g., show an error message)
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
    }
  ];

  

  return (
    <div>
      <h1>All Listings</h1>
      <DataTable columns={columns} data={listings} />
    </div>
  );
}

export default MyListing;
