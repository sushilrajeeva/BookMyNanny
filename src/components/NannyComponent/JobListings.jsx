import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  getAllListings,
  getNannyById,
  nannyInterested,
  withdrawNannyInterest,
} from "../../firebase/NannyFunctions";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";

// Importing card from shadcn
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Importing Skeleton for showing loading from shadcn
import { Skeleton } from "@/components/ui/skeleton";

// Importing input ui from shadcn
import { Input } from "@/components/ui/input";
import { getParentById } from "@/firebase/ParentFunctions";

function formatFirestoreTimestamp(timestamp) {
  // Checking if timestamp is a Firestore Timestamp object
  // did this because some posted dates are just strings and some are firestore timestamp functions
  // so implemented the below logic to counter the error while rendering
  if (timestamp && typeof timestamp.toDate === "function") {
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  } else if (timestamp) {
    return timestamp;
  }
  return "";
}

function JobListings() {
  const [jobListings, setJobListings] = useState([]);
  const [parentDetails, setParentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, userRole } = useContext(AuthContext);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listings = await getAllListings();

        console.log("All listings");
        console.log(listings);

        // Fetch parent data for each listing
        const listingsWithParentData = await Promise.all(
          listings.map(async (listing) => {
            const parentData = await getParentById(listing.parentID);
            return {
              ...listing,
              parentData,
            };
          })
        );

        setJobListings(listingsWithParentData);
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

  const handleNannyInterest = async (listingId, e) => {
    e.preventDefault();
    console.log("Handle nanny interest is called");
    console.log("ListingID:", listingId);
    console.log("NannyID:", currentUser.uid);
    const success = await nannyInterested(listingId, currentUser.uid);
    if (success) {
      console.log("Nanny added to InterestedNanny list successfully");
      // Update only the modified listing
      setJobListings((prevListings) =>
        prevListings.map((listing) =>
          listing._id === listingId
            ? {
                ...listing,
                interestedNannies: [
                  ...listing.interestedNannies,
                  currentUser.uid,
                ],
              }
            : listing
        )
      );
    }
  };

  // Wrote a custom function to get initials from displayName
const getInitials = (name) => {
  const parts = name.split(' ');
  const initials = parts.length > 1
    ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
    : parts[0].charAt(0);
  return initials.toUpperCase();
};
  
  const handleNannyWithdraw = async (listingId, e) => {
    e.preventDefault();
    const success = await withdrawNannyInterest(listingId, currentUser.uid);
    if (success) {
      console.log("Nanny removed from InterestedNanny list successfully");
      // Update only the modified listing
      setJobListings((prevListings) =>
        prevListings.map((listing) =>
          listing._id === listingId
            ? {
                ...listing,
                interestedNannies: listing.interestedNannies.filter(
                  (uid) => uid !== currentUser.uid
                ),
              }
            : listing
        )
      );
    }
  };

  const filteredListings = jobListings.filter(
    (listing) =>
      listing.listingName.toLowerCase().includes(searchQuery) ||
      listing.description.toLowerCase().includes(searchQuery) ||
      formatFirestoreTimestamp(listing.postedDate)
        .toLowerCase()
        .includes(searchQuery) ||
      listing.hourlyRate.toString().toLowerCase().includes(searchQuery)
  );

  // To conditinoally render on loading animation
  const SkeletonCard = () => (
    <div className="w-full max-w-[800px] mb-20">
      <Card className="hover:shadow-lg transition duration-300 ease-in-out rounded-lg p-4">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Skeleton className="w-[80px] h-[80px] rounded-full mr-4" />
              <div>
                <Skeleton className="h-6 w-36 mb-1" /> {/* Adjust the width as needed */}
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-8 w-20" />
        </CardFooter>
      </Card>
    </div>
  );


  if (isLoading) {
    return (
      <div className="flex flex-col items-center min-h-screen pt-4">
        <h1>Job Listings</h1>
        <Skeleton className="mb-5 w-full max-w-md h-10" />
        <div className="flex flex-col items-center w-full px-4">
          <SkeletonCard />
          <SkeletonCard />
          {/* Add more SkeletonCards if needed */}
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="flex flex-col items-center min-h-screen pt-4">
        <h1>Job Listings</h1>
        <Input
          type="text"
          placeholder="Search listings..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-5 w-full max-w-md"
        />
        <div className="flex flex-wrap justify-center gap-4 w-full px-4">
          {filteredListings.map((listing, index) => (
            <div key={index} className="w-[800px] h-[150px] mb-20">
              <Link to={`/listing/${listing._id}`}>
                <Card className="flex justify-between hover:shadow-lg transition duration-300 ease-in-out rounded-lg p-4">
                  <CardHeader>
                    <div className="flex flex-col items-center space-x-4">
                    {listing.parentData?.image ? (
                        <img
                          src={listing.parentData.image}
                          alt={`${listing.parentData?.firstName} ${listing.parentData?.lastName}`}
                          className="w-[80px] h-[80px] rounded-full"
                        />
                      ) : (
                        <div className="w-[80px] h-[80px] rounded-full bg-blue-200 flex items-center justify-center text-lg font-semibold">
                          {getInitials(`${listing.parentData?.firstName} ${listing.parentData?.lastName}`)}
                        </div>
                      )}
                      <div>
                        <CardDescription className="text-gray-900">
                          {`${listing.parentData?.firstName} ${listing.parentData?.lastName}`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Posted Date:{" "}
                      {formatFirestoreTimestamp(listing.postedDate)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl font-semibold">
                      {listing.listingName}
                    </CardTitle>
                    <p>
                      <strong>Job Start Date:</strong> {listing.jobStartDate}
                    </p>
                    <p>
                      <strong>Job End Date:</strong> {listing.jobEndDate}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {listing.pincode}
                    </p>
                    <p>
                      <strong>Hourly Rate:</strong> {listing.hourlyRate}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {listing.interestedNannies &&
                    listing.interestedNannies.includes(currentUser.uid) ? (
                      <Button
                        variant="destructive"
                        onClick={(e) => handleNannyWithdraw(listing._id, e)}
                      >
                        Withdraw
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={(e) => handleNannyInterest(listing._id, e)}
                      >
                        Apply
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default JobListings;
