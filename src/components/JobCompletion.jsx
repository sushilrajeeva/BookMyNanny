import React, { useState, useContext, useEffect } from "react";
import { onJobComplete } from "@/firebase/NannyFunctions";
import { AuthContext } from "@/context/AuthContext";
import { checkNumber } from "../helpers/index.js";
import { Card, CardContent } from "./ui/card.jsx";
import { Typography } from "@mui/material";

function JobCompletion({ listing, onUpdatedListing }) {
  const [showForm, setShowForm] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(0);
  const auth = useContext(AuthContext);

  const handleCompleteJob = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      checkNumber(parseFloat(hoursWorked), "hours worked");
      console.log("LID", listing._id);
      await onJobComplete(listing._id, hoursWorked, auth.currentUser.uid);
      onUpdatedListing();
      // Reset state
      setHoursWorked(0);
      setShowForm(false);
    } catch (error) {
      console.error(`Error completing job: ${error}`);
    }
  };

  return listing.status === "pending" && listing.progressBar === 0 ? (
    <div>
      <button onClick={handleCompleteJob}>Complete Job</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>
            Number of Hours Worked:
            <input
              type="number"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  ) : listing.status === "completed" && listing.progressBar === 0 ? (
    <Card>
      <CardContent>
        <Typography variant="h6">Your request has been submitted</Typography>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardContent>
        <Typography variant="h6">Payment Completed</Typography>
      </CardContent>
    </Card>
  );
}

export default JobCompletion;
