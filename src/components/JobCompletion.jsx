import React, { useState } from "react";
import { onJobComplete } from "@/firebase/NannyFunctions";


function JobCompletion({ listing }) {
  const [showForm, setShowForm] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(0);

  const handleCompleteJob = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform any validation if needed
    // Call the data function to update the listing with hoursWorked
    console.log(hoursWorked)
    console.log(listing._id)
    await onJobComplete(listing._id, hoursWorked);
    // Reset state
    setHoursWorked(0);
    setShowForm(false);
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
