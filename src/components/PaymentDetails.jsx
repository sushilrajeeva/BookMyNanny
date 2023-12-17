import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Button as DeclineBtn } from "@/components/ui/button";
import { jobClose, jobDecline } from "@/firebase/ParentFunctions";

const PaymentDetails = ({ listing, onUpdatedListing }) => {
  const payableAmount = listing.hoursWorked * listing.hourlyRate;

  const handleJobCompletion = async () => {
    try {
      await jobClose(listing._id);
      onUpdatedListing();
    } catch (error) {
      // Handle error and notify the user
      console.error("Error closing job:", error);
      alert("Error marking job complete. Please try again later.");
    }
  };

  const handleDecline = async () => {
    try {
      await jobDecline(listing._id);
      onUpdatedListing();
    } catch (error) {
      // Handle error and notify the user
      console.error("Error closing job:", error);
      alert("Error marking job complete. Please try again later.");
    }
  };

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
        <br />
        <br />
        <Button
          // sx={{ backgroundColor: "red" }}
          color="error"
          variant="contained"
          onClick={handleDecline}
        >
          Decline
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
