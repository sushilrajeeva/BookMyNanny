import React, { useEffect, useState } from 'react';
import {getAllListings } from '../firebase/ParentFunctions';
import DataTable from '../components/ListingTable/data-table';

function ActiveListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const allListings = await getAllListings();
        setListings(allListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  const isListingActive = (endTime) => {
    const currentDate = new Date();
    if (!endTime || typeof endTime !== 'string' || endTime.trim() === '') {
      console.error('Invalid endTime value:', endTime);
      return false; // or handle the error in a way that makes sense for your application
    }
    // Parse the endTime string into a Date object
    const endTimeParts = endTime.split('-');
    const endTimeDate = new Date(
      parseInt(endTimeParts[2]),  // year
      parseInt(endTimeParts[0]) - 1,  // month (months are zero-based in JavaScript)
      parseInt(endTimeParts[1])       // day
    );

    // Validate if endTimeDate is a valid date
    if (isNaN(endTimeDate.getTime())) {
      console.error('Invalid date format for endTime:', endTime);
      return false; // or handle the error in a way that makes sense for your application
    } 

    currentDate.setHours(0, 0, 0, 0);
    endTimeDate.setHours(0, 0, 0, 0);
    console.log(endTimeDate)
    console.log(endTimeDate<currentDate)
    // Compare the endTime with the current date and time
    return endTimeDate > currentDate;
  };

  const activeListings = listings.filter((listing) =>
    isListingActive(listing.jobEndDate)
  );

  const columns = [
    {
      accessorKey: 'listingName',
      header: 'Listing Name',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => (isListingActive(info.row.original.jobEndDate) ? 'Active' : 'Past'),
    },
  ];

 return (
    <div>
      <h1>Active Listings</h1>
      <DataTable columns={columns} data={activeListings} />
    </div>
  );
}

export default ActiveListings;
