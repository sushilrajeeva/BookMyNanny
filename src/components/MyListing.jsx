


import React, { useEffect, useState, useContext } from 'react';
import { getAllListings } from '../firebase/ParentFunctions';
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";


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

  const handleViewListingClick = (listingId) => {
    console.log(`View Listing is called for ${listingId}`);
    // Add your logic to redirect or perform any action when viewing a listing
  };

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
    <div className="flex flex-wrap justify-center gap-5 w-full px-4">
      {listings.map((listing, index) => (
        <Card key={index} className="w-[300px]">
          <CardHeader>
            <CardTitle>{listing.listingName}</CardTitle>
            <CardDescription>
              <strong>Posted Date:</strong> {listing.postedDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
              <p><strong>Description:</strong> {listing.description}</p>
              <p><strong>Hourly Rate:</strong> {listing.hourlyRate}</p>
            </CardContent>
          <CardFooter className="flex justify-between">
            <button
              onClick={() => handleViewListingClick(listing._id)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              View Listing
            </button>
            <button
              onClick={() => handleViewListingClick(listing._id)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Edit Listing
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default MyListing;
