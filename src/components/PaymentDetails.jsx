import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Button as DeclineBtn } from "@/components/ui/button";
import { jobClose, jobDecline } from "@/firebase/ParentFunctions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
    <Card className="flex flex-col items-center">
      <CardContent className="flex flex-col items-center">
        <Typography variant="h6">Payment Details</Typography>
        <br />
        <Typography variant="body1">Amount due:</Typography>
        <Typography variant="h5">${payableAmount.toFixed(2)}</Typography>
        <Typography>Dont forget to tip if you enjoyed the service</Typography>
        <br />
        <Button variant="contained" onClick={handleJobCompletion}>
          Mark Job Completed
        </Button>

        <Button
          // mt={2}
          color="error"
          variant="contained"
          onClick={handleDecline}
          sx={{ marginTop: "10px" }}
        >
          Decline
        </Button>
      </CardContent>
    </Card>
  ) : (
    <Card className="flex flex-col items-center">
      <CardContent className="flex flex-col items-center">
        <CheckCircleIcon fontSize="large" color="success" />
        <Typography variant="h6" mt={2}>
          Payment Completed
        </Typography>
        <div>
          <Typography variant="body1">Amount paid</Typography>
          <Typography variant="h5">
            ${(listing.hoursWorked * listing.hourlyRate).toFixed(2)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentDetails;
