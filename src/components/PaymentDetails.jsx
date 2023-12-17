import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { jobClose } from "@/firebase/ParentFunctions";

const PaymentDetails = ({ listing }) => {
  const [listingData, setListingData] = useState(listing);
  const payableAmount = listing.hoursWorked * listing.hourlyRate;

  const handleJobCompletion = async () => {
    try {
      await jobClose(listing._id);
      // Show success message to the user
      alert("Job successfully marked as completed!");
    } catch (error) {
      // Handle error and notify the user
      console.error("Error closing job:", error);
      alert("Error marking job complete. Please try again later.");
    }
  };

  console.log("LISTINGS", listingData);

  return listing.status === "completed" && listing.progressBar === 0 ? (
    <Card>
      <CardContent>
        <Typography variant="h6">Payment Details</Typography>
        <br />
        <Typography variant="body1">Amount due:</Typography>
        <Typography variant="h5">${payableAmount.toFixed(2)}</Typography>
        <Typography>Dont forget to tip if you enjoyed the service</Typography>
        <br />
        <Button variant="contained" onClick={handleJobCompletion}>
          Mark Job Completed
        </Button>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardContent>
        <Typography variant="h6">Payment Completed</Typography>
      </CardContent>
    </Card>
  );
};

export default PaymentDetails;
