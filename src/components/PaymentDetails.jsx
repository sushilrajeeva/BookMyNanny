import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Button as DeclineBtn } from "@/components/ui/button";
import { jobClose, jobDecline } from "@/firebase/ParentFunctions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { loadStripe } from '@stripe/stripe-js';

const PaymentDetails = ({ listing, onUpdatedListing }) => {
  const payableAmount = listing.hoursWorked * listing.hourlyRate;
  const [stripe, setStripe] = useState(null);

  // useEffect(() => {
  //   // Initialize Stripe
  //   const initStripe = async () => {
  //     const stripeInstance = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  //     setStripe(stripeInstance);
  //   };

  //   initStripe();
  // }, []);

  // Payment Integration
    // I referred the npm documentation for stripe - reference -> https://www.npmjs.com/package/@stripe/stripe-js
  const handleStripeCheckout = async () => {

    // Here I am pasting my stripe developer account publishing key
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    console.log("This is my publishable key - ", publishableKey);
    const stripe = await loadStripe(publishableKey);

    // Create the Stripe checkout session
    const body = {
      transaction: [
        {
          description: `BookMyNanny Payment`,
          price: payableAmount,
          payerID: listing.parentID,
          payeeID: listing.selectedNannyID,
          listingID: listing._id,

        }
      ]
    };
    const headers = {
      "Content-Type": "application/json"
    };
    const response = await fetch("http://localhost:3000/api/create-checkout-session", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });
    console.log("wtfff");
    const session = await response.json();

    console.log("interesting...");
    // Redirect to Stripe checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });
    console.log(" called soon");
    if (result.error) {
      console.error("Error in Stripe checkout", result.error);
    }
  };

  const handleJobCompletion = async () => {
    try {
      await handleStripeCheckout();
      await jobClose(listing._id);
      onUpdatedListing();
    } catch (error) {
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
        <Typography className="text-black flex flex-col items-center" variant="h6" mt={2}>
          Payment Completed
        </Typography>
        <div>
          <Typography className="text-black flex flex-col items-center" variant="body1">Amount paid</Typography>
          <Typography className="text-black flex flex-col items-center" variant="h5">
            ${(listing.hoursWorked * listing.hourlyRate).toFixed(2)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentDetails;
