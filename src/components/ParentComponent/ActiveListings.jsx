import React, { useEffect, useState, useContext } from 'react';
import {getAllListings, getActiveListings } from '../../firebase/ParentFunctions';
import DataTable from '../ListingTable/data-table';
import { AuthContext } from "../../context/AuthContext";
import { columns } from "../ListingTable/columns"
import CustomLoading from '../EssentialComponents/CustomLoading';


function ActiveListings() {
  const [listings, setListings] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Check if there is a logged-in user with the parent role
        if (currentUser && userRole === 'parent' && currentUser.uid        ) {
          const parentListings = await getActiveListings(currentUser.uid);
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

  // const columns = [
  //   {
  //     accessorKey: 'listingName',
  //     header: 'Listing Name',
  //   },
  //   {
  //     accessorKey: 'status',
  //     header: 'Status',
  //     cell: (info) => (isListingActive(info.row.original.jobEndDate) ? 'Active' : 'Past'),
  //   },
  //   {
  //     accessorKey: 'jobStartDate',
  //     header: 'Start Date',
  //   },
  //   {
  //     accessorKey: 'jobEndDate',
  //     header: 'End Date',
  //   },
  // ];

  if (loadingListings) {
    return (
      <div>
        <CustomLoading/>
      </div>
    );
  }

 return (
    <div>
      <h1>Active Listings</h1>
      <DataTable columns={columns} data={activeListings} />
    </div>
  );
}

export default ActiveListings;
