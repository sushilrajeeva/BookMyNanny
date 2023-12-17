import React, { useState, useContext } from "react";
import { onJobComplete } from "@/firebase/NannyFunctions";
import { AuthContext } from "@/context/AuthContext";
import { checkNumber } from "../helpers/index.js";

function JobCompletion({ listing }) {
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
      // Reset state
      setHoursWorked(0);
      setShowForm(false);
    } catch (error) {
      console.error(`Error completing job: ${error}`);
    }
  };

  return (
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
  );
}

export default JobCompletion;
