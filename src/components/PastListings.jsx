import React, { useEffect, useState, useContext } from 'react';
import {getAllListings } from '../firebase/ParentFunctions';
import DataTable from '../components/ListingTable/data-table';
import { AuthContext } from "../context/AuthContext";



function PastListings() {
  const [listings, setListings] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
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

  
  

  const isListingPast = (endTime) => {
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
    return endTimeDate < currentDate;
  };

  const pastListings = listings.filter((listing) =>
  isListingPast(listing.jobEndDate)
  );

  const columns = [
    {
      accessorKey: 'listingName',
      header: 'Listing Name',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => (isListingPast(info.row.original.jobEndDate) ? 'Past' : 'Active'),
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
      <h1>Past Listings</h1>
      <DataTable columns={columns} data={pastListings} />
    </div>
  );
}

export default PastListings;
