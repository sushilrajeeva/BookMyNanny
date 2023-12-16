import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  getAllListings,
  nannyInterested,
  withdrawNannyInterest,
} from "../../firebase/NannyFunctions";
import { AuthContext } from "../../context/AuthContext";
import ListingFullDetails from "../ListingFullDetails";
// Importing Button from shadcn
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  // To conditinoally render on loading animation
  const renderSkeleton = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index} className="w-[300px]">
          <CardHeader>
            <Skeleton height="20px" width="70%" />
          </CardHeader>
          <CardContent>
            <Skeleton height="15px" width="90%" />
            <Skeleton height="15px" width="85%" style={{ marginTop: "10px" }} />
            <Skeleton height="15px" width="80%" style={{ marginTop: "10px" }} />
            <Skeleton height="15px" width="75%" style={{ marginTop: "10px" }} />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Skeleton height="35px" width="48%" className="rounded-md" />
            <Skeleton height="35px" width="48%" className="rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const handleNannyWithdraw = async (listingId) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {renderSkeleton()}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-10">
      <h1>Job Listings</h1>
      <Input
        type="text"
        placeholder="Search listings..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-5 w-full max-w-md"
      />
      <div className="flex flex-wrap justify-center gap-5 w-full px-4">
        {filteredListings.map((listing, index) => (
          <Card key={index} className="w-[300px]">
            <CardHeader>
              <CardTitle>{listing.listingName}</CardTitle>
              <CardDescription>
                <strong>Posted Date:</strong>{" "}
                {formatFirestoreTimestamp(listing.postedDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Description:</strong> {listing.description}
              </p>
              <p>
                <strong>Hourly Rate:</strong> {listing.hourlyRate}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to={`/listing/${listing._id}`}>
                <button
                  onClick={() => console.log("View Listing is called")}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  View Listing
                </button>
              </Link>
              {listing.interestedNannies &&
              listing.interestedNannies.includes(currentUser.uid) ? (
                <Button
                  variant="destructive"
                  onClick={() => handleNannyWithdraw(listing._id)}
                >
                  Withdraw
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => handleNannyInterest(listing._id)}
                >
                  Apply
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default JobListings;
