


import React, { useEffect, useState } from 'react';
import { getAllListings } from '../firebase/ParentFunctions';

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

  return (
    <div>
      <h1>All Listings</h1>
      <ul>
        {listings.map((listing) => (
          <li key={listing.listingName}>
            <strong>{listing.listingName}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyListing;
