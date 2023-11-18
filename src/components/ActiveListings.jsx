import React, { useEffect, useState } from 'react';
import {getAllListings } from '../firebase/ParentFunctions';

function ActiveListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const allListings = await getAllListings();
        setListings(allListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Handle the error appropriately (e.g., show an error message)
      }
    };

    fetchListings();
  }, []);

  const isListingActive = (endTime) => {
    const currentDateTime = new Date();
    const endTimeDate = endTime.toDate(); // Convert Firebase Timestamp to JavaScript Date object

    // Compare the endTime with the current date and time
    return endTimeDate > currentDateTime;
  };
  const activeListings = listings.filter((listing) =>
    isListingActive(listing.endTime)
  );

  return (
    <div>
      <h1>Active Listings</h1>
      <ul>
        {activeListings.map((listing) => (
          <li key={listing.listingName}>
            <strong>{listing.listingName}</strong>
            <p>{isListingActive(listing.endTime) ? 'Active' : 'Past'}</p>
            {/* Add other listing details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActiveListings;
