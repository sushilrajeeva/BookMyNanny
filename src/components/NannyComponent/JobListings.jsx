import React, { useState, useEffect, useContext } from "react";

import { getAllListings, nannyInterested, withdrawNannyInterest } from "../../firebase/NannyFunctions";
import { AuthContext } from "../../context/AuthContext";

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
  const { currentUser, userRole } = useContext(AuthContext);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listings = await getAllListings();
        console.log("All listings");
        console.log(listings);
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

  const handleNannyInterest = async (listingId) => {
    console.log("Handle nanny interest is called");
    console.log("ListingID:", listingId);
    console.log("NannyID:", currentUser.uid);
    const success = await nannyInterested(listingId, currentUser.uid);
    if (success) {
      console.log("Nanny added to InterestedNanny list successfully");
      // Update only the modified listing
      setJobListings(prevListings =>
        prevListings.map(listing =>
          listing._id === listingId
            ? { ...listing, interestedNannies: [...listing.interestedNannies, currentUser.uid] }
            : listing
        )
      );
    }
  };

  const handleNannyWithdraw = async (listingId) => {
    const success = await withdrawNannyInterest(listingId, currentUser.uid);
    if (success) {
      console.log("Nanny removed from InterestedNanny list successfully");
      // Update only the modified listing
      setJobListings(prevListings =>
        prevListings.map(listing =>
          listing._id === listingId
            ? { ...listing, interestedNannies: listing.interestedNannies.filter(uid => uid !== currentUser.uid) }
            : listing
        )
      );
    }
  };
  

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
          <div key={index} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px', position: 'relative' }}>
            <h2>{listing.listingName}</h2>
            <div>
              <p><strong>Description:</strong> {listing.description}</p>
              <p><strong>Posted Date:</strong> {formatFirestoreTimestamp(listing.postedDate)}</p>
              <p><strong>Hourly Rate:</strong> {listing.hourlyRate}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button 
                onClick={() => console.log('View Listing is called')} 
                style={{ backgroundColor: 'blue', color: 'white', padding: '10px 15px', borderRadius: '5px', flex: '1', marginRight: '5px' }}
              >
                View Listing
              </button>
              {listing.interestedNannies && listing.interestedNannies.includes(currentUser.uid) ? (
                <button 
                  onClick={() => handleNannyWithdraw(listing._id)}
                  style={{ backgroundColor: 'red', color: 'white', padding: '10px 15px', borderRadius: '5px', flex: '1', marginLeft: '5px' }}
                >
                  Withdraw Request
                </button>
              ) : (
                <button 
                  onClick={() => handleNannyInterest(listing._id)}
                  style={{ backgroundColor: 'green', color: 'white', padding: '10px 15px', borderRadius: '5px', flex: '1', marginLeft: '5px' }}
                >
                  I'm Interested
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobListings;

