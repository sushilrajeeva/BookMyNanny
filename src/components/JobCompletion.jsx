import React, { useState, useContext } from "react";
import { onJobComplete } from "@/firebase/NannyFunctions";
import { AuthContext } from "@/context/AuthContext";
import { checkNumber } from "../helpers/index.js";
import { Card, CardContent } from "@/components/ui/card";
import { Typography, TextField, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function JobCompletion({ listing, onUpdatedListing }) {
  const [showForm, setShowForm] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [calculate, setCalculate] = useState(false);
  const [totalPay, setTotalPay] = useState(0);
  const auth = useContext(AuthContext);

  const handleCompleteJob = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setCalculate(false);
  };

  const handleCalculate = () => {
    const total = hoursWorked * listing.hourlyRate;
    setTotalPay(total);
    setCalculate(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      checkNumber(parseFloat(hoursWorked), "hours worked");
      await onJobComplete(listing._id, hoursWorked, auth.currentUser.uid);
      onUpdatedListing();
      // Reset state
      setHoursWorked(0);
      setShowForm(false);
    } catch (error) {
      console.error(`Error completing job: ${error}`);
    }
  };

  return (
    <Card className="mt-5">
      <CardContent>
        {listing.status === "pending" && listing.progressBar === 0 && (
          <Box>
            <Button
              className="mt-5"
              color="primary"
              onClick={handleCompleteJob}
              disabled={showForm}
            >
              Complete Job
            </Button>
          </Box>
        )}

        {showForm && (
          <Box mt={5} component="form" onSubmit={handleSubmit}>
            <TextField
              type="number"
              label="Number of Hours Worked"
              variant="outlined"
              fullWidth
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleCalculate}
                  color="primary"
                  className="mt-4 mr-5"
                >
                  Calculate
                </Button>
              </AlertDialogTrigger>
              <Button onClick={handleCancel} variant="destructive" mt={2}>
                Cancel
              </Button>
              {/* {calculate && (
              <div className="p-4 border border-gray-400 bg-white rounded-lg">
                <p>{totalPay}</p>
                <div className="text-gray-700 text-base mb-4">
                  Are you sure you want to submit the Hours worked?
                </div>
                <Button onClick={handleConfirmSubmission}>Yes</Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )} */}
              {calculate && (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div>
                      <Typography variant="h6">Payment Details</Typography>
                      <Typography variant="body1">Your Total Pay</Typography>
                      <Typography variant="h5">
                        ${totalPay.toFixed(2)}
                      </Typography>
                    </div>
                    <AlertDialogDescription>
                      Are you sure you want to submit the hours worked?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <form onSubmit={handleSubmit}>
                      <AlertDialogAction asChild>
                        <Button type="submit">Submit</Button>
                      </AlertDialogAction>
                    </form>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              )}
            </AlertDialog>
          </Box>
        )}

        {listing.status === "completed" && listing.progressBar === 0 && (
          <CardContent>
            <CheckCircleIcon fontSize="large" color="warning" />
            <Typography variant="h6" mt={2}>
              Request Submitted
            </Typography>
            <div>
              <Typography variant="body1">Your Total Pay</Typography>
              <Typography variant="h5">
                ${(listing.hoursWorked * listing.hourlyRate).toFixed(2)}
              </Typography>
            </div>
            <Typography mt={3} variant="body2" color="red">
              Diclaimer: If your payment request has been declined, you will be
              able to re-enter the work hours. Please co-ordinate with the
              parent using the Chat if any discrepancies.
            </Typography>
            <Typography mt={3} variant="body2" color="text.secondary">
              Your request has been submitted and is awaiting approval from the
              parent.
            </Typography>
          </CardContent>
        )}

        {listing.status === "completed" && listing.progressBar === 100 && (
          <CardContent>
            <CheckCircleIcon fontSize="large" color="success" />
            <Typography variant="h6" mt={2}>
              Payment Completed
            </Typography>
            <div>
              <Typography variant="body1">Your Total Pay</Typography>
              <Typography variant="h5">
                ${(listing.hoursWorked * listing.hourlyRate).toFixed(2)}
              </Typography>
            </div>
          </CardContent>
        )}
      </CardContent>
    </Card>
  );
}

export default JobCompletion;
