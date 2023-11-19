import React, { useState, useEffect } from "react";
import { getAllListings } from "../firebase/NannyFunctions";

function formatFirestoreTimestamp(timestamp) {
  // Checking if timestamp is a Firestore Timestamp object
  // did this because some posted dates are just strings and some are firestore timestamp functions
  // so implemented the below logic to counter the error while rendering
  if (timestamp && typeof timestamp.toDate === 'function') {
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  } else if (timestamp) {
    return timestamp;
  }
  return '';
}


function JobListings() {
  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchListings() {
      try {
        const listings = await getAllListings();
        setJobListings(listings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
      setIsLoading(false);
    }

    fetchListings();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toString().toLowerCase());
  };

  // logic for search
  const filteredListings = jobListings.filter(listing => 
    listing.listingName.toLowerCase().includes(searchQuery) ||
    listing.description.toLowerCase().includes(searchQuery) ||
    formatFirestoreTimestamp(listing.postedDate).toLowerCase().includes(searchQuery)  ||
    listing.hourlyRate.toString().toLowerCase().includes(searchQuery)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Job Listings</h1>
      <input 
        type="text" 
        placeholder="Search listings..." 
        value={searchQuery} 
        onChange={handleSearchChange} 
        style={{ marginBottom: '20px' }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
        {filteredListings.map((listing, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px' }}>
            <h2>{listing.listingName}</h2>
            <p><strong>Description:</strong> {listing.description}</p>
            <p><strong>Posted Date:</strong> {formatFirestoreTimestamp(listing.postedDate)}</p>
            <p><strong>Hourly Rate:</strong> {listing.hourlyRate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export default JobListings;
