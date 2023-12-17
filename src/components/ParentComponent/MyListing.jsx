// MyListing.js
import React, { useState, useContext, useEffect } from "react";
import { getAllListings, updateListing } from "../../firebase/ParentFunctions"; // Assuming there is an updateListing function
import { AuthContext } from "../../context/AuthContext";
import { deleteListing } from "@/firebase/ListingFunctions";
import ViewListing from "./ViewListing";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import CustomLoading from "../EssentialComponents/CustomLoading";

function MyListing() {
  const [listings, setListings] = useState([]);
  const { currentUser, userRole } = useContext(AuthContext);
  const [loadingListings, setLoadingListings] = useState(true);

  // State to track the selected listing for view or edit
  const [selectedListing, setSelectedListing] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    // Fetch all listings when the component mounts
    const fetchListings = async () => {
      try {
        // Check if there is a logged-in user with the parent role
        if (currentUser && userRole === "parent" && currentUser.uid) {
          const parentListings = await getAllListings(currentUser.uid);
          setListings(parentListings);
          console.log(parentListings);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoadingListings(false);
        setIsDelete(false);
      }
    };

    fetchListings();
  }, [isDelete]);

  const handleViewListingClick = (listingId) => {
    const selectedListing = listings.find(
      (listing) => listing._id === listingId
    );
    setSelectedListing(selectedListing);
    setIsEditing(false);
  };

  const handleDeleteListingClick = (listingId) => {
    deleteListing(listingId);
    alert("Done");
    setIsDelete(true);
  };

  const handleBackToListings = () => {
    setSelectedListing(null);
    setIsEditing(false);
  };

  const handleSaveChanges = async (listingId, updatedData) => {
    try {
      // Assuming there is an updateListing function to update the listing in the backend
      console.log("Updating listing with ID:", listingId);
      console.log("Updated Data:", updatedData.updatedData);
      await updateListing(listingId, updatedData.updatedData);

      // Fetch updated listings
      const parentListings = await getAllListings(currentUser.uid);
      setListings(parentListings);
      console.log("Listings updated successfully:", parentListings);
    } catch (error) {
      console.error("Error updating listing:", error);
    } finally {
      setSelectedListing(null);
      setIsEditing(false);
    }
  };

  if (loadingListings) {
    return (
      <div>
        <CustomLoading/>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-5 w-full px-4">
      {selectedListing && !isEditing ? (
        <ViewListing
          listing={selectedListing}
          onBackClick={handleBackToListings}
          onEditClick={handleDeleteListingClick}
        />
      ) : (
        listings.map((listing, index) => (
          <Card key={index} className="w-[300px]">
            {/* Display listing information */}
            <CardHeader>
              <CardTitle>{listing.listingName}</CardTitle>
              <CardDescription>
                <strong>Posted Date:</strong> {listing.postedDate}
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
              {/* <button
                onClick={() => handleViewListingClick(listing._id)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                View Listing
              </button> */}
              <button
                onClick={() => handleDeleteListingClick(listing._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete Listing
              </button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}

export default MyListing;
