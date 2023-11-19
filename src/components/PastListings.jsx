import React, { useEffect, useState } from 'react';
import {getAllListings } from '../firebase/ParentFunctions';

function PastListings() {
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

  const isListingPast = (endTime) => {
    const currentDateTime = new Date();
    const endTimeDate = new Date(endTime); 
    console.log(endTime)
    console.log(endTime<currentDateTime)
    // Compare the endTime with the current date and time
    return endTimeDate < currentDateTime;
  };
  const pastListings = listings.filter((listing) =>
  isListingPast(listing.endTime)
  );

  return (
    <div>
      <h1>Past Listings</h1>
      <ul>
        {pastListings.map((listing) => (
          <li key={listing.listingName}>
            <strong>{listing.listingName}</strong>
            <p>{isListingPast(listing.endTime) ? 'Past' : 'Active'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PastListings;
