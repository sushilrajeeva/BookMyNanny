// ViewListing.js
import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const ViewListing = ({ listing, onBackClick, onEditClick }) => (
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

export default ViewListing;
