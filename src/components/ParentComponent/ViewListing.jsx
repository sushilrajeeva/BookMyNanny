import React, { useState, useEffect } from 'react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getNannyById } from "../../firebase/NannyFunctions";
import { addSelectedNanny } from "../../firebase/ParentFunctions";

const ViewListing = ({ listing, onBackClick, onEditClick }) => {
  const [selectedNannyDetails, setSelectedNannyDetails] = useState([]);
  const [interestedNanniesDetails, setInterestedNanniesDetails] = useState([]);

  useEffect(() => {
    const fetchNannyDetails = async () => {
      // Fetch details of selected nanny if there is one
      if (listing.selectedNannyID) {
        const selectedNannyDetail = await getNannyById(listing.selectedNannyID);
        setSelectedNannyDetails([selectedNannyDetail]);
      } else {
        // Fetch details of interested nannies when component mounts
        const nannyDetailsPromises = listing.interestedNannies.map(nannyId =>
          getNannyById(nannyId)
        );
        const nannyDetails = await Promise.all(nannyDetailsPromises);
        setInterestedNanniesDetails(nannyDetails);
      }
    };

    fetchNannyDetails();
  }, [listing.selectedNannyID, listing.interestedNannies]);

  const handleSelectNanny = (selectedNannyId) => {
    addSelectedNanny(listing._id, selectedNannyId);
    console.log("Selected Nanny ID:", selectedNannyId);
    console.log("Listing ID:", listing._id);
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>{listing.listingName}</CardTitle>
        <CardDescription>
          <strong>Posted Date:</strong> {listing.postedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Description:</strong> {listing.description}</p>
        <p><strong>Hourly Rate:</strong> {listing.hourlyRate}</p>
        <p><strong>Job Start Date:</strong> {listing.jobStartDate}</p>
        <p><strong>Job End Date:</strong> {listing.jobEndDate}</p>
        <p><strong>Payable Hours:</strong> {listing.payableHours}</p>
        <p><strong>Kid Info:</strong> {listing.kidInfo}</p>
        <p><strong>Nannies:</strong></p>
        {selectedNannyDetails.length > 0 ? (
          // Display details of the selected nanny
          selectedNannyDetails.map((nanny, index) => (
            <div key={index}>
              <p><strong>Nanny Name:</strong> {nanny.displayName}</p>
              <p><strong>Nanny Experience:</strong> {nanny.experience}</p>
            </div>
          ))
        ) : (
          // Display details of interested nannies
          interestedNanniesDetails.map((nanny, index) => (
            <div key={index}>
              <p><strong>Nanny Name:</strong> {nanny.displayName}</p>
              <p><strong>Nanny Experience:</strong> {nanny.experience}</p>
              <button onClick={() => handleSelectNanny(nanny._id)}>
                Select Nanny
              </button>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <button
          onClick={onBackClick}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Back to My Listings
        </button>
        <button
          onClick={() => onEditClick(listing._id)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Edit Listing
        </button>
      </CardFooter>
    </div>
  );
};

export default ViewListing;
